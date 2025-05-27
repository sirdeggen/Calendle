import React, { useState, useEffect, createContext } from 'react';
import { Game } from './components/Game';
import { Header } from './components/Header/Header';
import { CalendleState } from './models/CalendleState';
import { WalletClient } from '@bsv/sdk';
import { TakePayment } from './components/TakePayment';
import { checkPaymentStatus } from './utils/paymentUtils';
import { Beef } from '@bsv/sdk';

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
  const [theme, setTheme] = useState('light');
  const [gameState] = useState(new CalendleState());

  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const wallet = new WalletClient('auto', 'calendle.co');

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
        
        const paid = await checkPaymentStatus(tx, vout);
        setHasPaid(paid);
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
