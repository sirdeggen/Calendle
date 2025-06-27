import React, { useState, useEffect, createContext } from 'react';
import { Game } from './components/Game';
import { Header } from './components/Header/Header';
import { CalendleState } from './models/CalendleState';
import { CreateActionInput, LockingScript, PushDrop, WalletClient } from '@bsv/sdk';
import { TakePayment } from './components/TakePayment';
import { checkPaymentStatus } from './utils/paymentUtils';
import { Beef } from '@bsv/sdk';
import { Transaction, WalletOutput } from '@bsv/sdk';

// Define theme context with type
type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light', 
  setTheme: () => {} 
});

const App = () => {
  const date = new Date();
  const [statsDialogVisible, setStatsDialogVisible] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Check for user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [gameState] = useState(new CalendleState());

  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasRedeemedOldTokens, setHasRedeemedOldTokens] = useState(false);
  const wallet = new WalletClient('auto', 'calendle.co');

  async function redeemOldTokens(outputs: WalletOutput[], beef: Beef) {
    if (hasRedeemedOldTokens) return;
    try {
      setHasRedeemedOldTokens(true);
      const response = await wallet.listOutputs({
        basket: 'calendle',
        include: 'entire transactions'
      });

      const beef = Beef.fromBinary(response?.BEEF || [])

      let extraTokens = false;
      let paidAlready = false;
      
      if (response.outputs.length > 1) {
        const pd = new PushDrop(wallet, 'calendle.co')
        const fakeTx = new Transaction()
        fakeTx.addOutput({
          satoshis: 1,
          lockingScript: LockingScript.fromASM('OP_TRUE')
        })
        response.outputs.forEach(async (output) => {
          const [txid, vout] = output.outpoint.split('.')
          const sourceOutputIndex = Number(vout)
          const sourceTransaction = beef.findAtomicTransaction(txid)
          const ls = sourceTransaction?.outputs[sourceOutputIndex].lockingScript as LockingScript
          const paid = await checkPaymentStatus(sourceTransaction as Transaction, vout)
          if (paid) {
            paidAlready = true;
            return
          }
          extraTokens = true;
          const unlockingScriptTemplate = pd.unlock(
            [2, 'calendle'],
            '1',
            'self',
            'none',
            true,
            1,
            ls

          )
          fakeTx.addInput({
            sourceTransaction,
            sourceOutputIndex,
            unlockingScriptTemplate,
          })
        })

        if (paidAlready) setHasPaid(true);
        if (!extraTokens) return;
        
        await fakeTx.sign()

        console.log({ fakeTx: fakeTx.toHex() })

        const revokeTx = await wallet.createAction({
          inputBEEF: response.BEEF,
          inputs: response.outputs.map((output, idx) => ({
            outpoint: output.outpoint,
            inputDescription: 'Calendle Game Token',
            unlockingScript: fakeTx.inputs[idx].unlockingScript?.toHex()
          } as CreateActionInput)),
          description: 'Spend previous tokens',
          labels: ['calendle']
        })

        console.log({ revokeTx })
      }
    } catch (error) {
      console.error({ error })
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (hasPaid) return;
        const isAuthenticated = await wallet.isAuthenticated();
        if (!isAuthenticated) {
          throw new Error('Could not authenticate');
        }
        
        const response = await wallet.listOutputs({
          basket: 'calendle',
          include: 'entire transactions'
        });
        
        if (response?.outputs?.length <= 0) return console.error('No outputs found');
        
        const beef = Beef.fromBinary(response?.BEEF || [])


        const latestTokenOutpoint = response.outputs[response.outputs.length - 1].outpoint
        console.log({ latestTokenOutpoint })
        const [txid, vout] = latestTokenOutpoint.split('.')
        const tx = beef.findAtomicTransaction(txid)
        if (!tx) return console.error('Could not find transaction');
        
        await redeemOldTokens(response.outputs, beef);

      } catch (error) {
        console.error({ error });
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet])

  gameState.initialize();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Listen for changes in system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Define listener function
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      handleSetTheme(newTheme);
    };
    
    // Add listener for theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    gameState.setDarkMode(newTheme).update();
  };

  console.log({ loading, hasPaid });

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
      {loading ? (
        <>Loading...</>
      ) : hasPaid ? (
        <Game key={date.toDateString()} setStatsDialogVisible={setStatsDialogVisible}/>
      ) : (
        <TakePayment wallet={wallet} setHasPaid={setHasPaid} />
      )}
    </ThemeContext.Provider>
  );
};

export default App;
