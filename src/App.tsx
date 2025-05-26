import React, { useState, useEffect, createContext } from 'react';
import { Game } from './components/Game';
import { Header } from './components/Header/Header';
import { CalendleState } from './models/CalendleState';
import { WalletClient, Script, PushDrop, Utils } from '@bsv/sdk';
import { TakePayment } from './components/TakePayment';

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
        const isAuthenticated = await wallet.isAuthenticated()
        if (!isAuthenticated) {
          throw new Error('Could not authenticate')
        }
        const response = await wallet.listOutputs({
          basket: 'calendle'
        })
        console.log(response)
        if (response?.outputs?.length > 0) {
          const script = Script.fromHex(response.outputs[0].lockingScript ?? '')
          const pushDrop = PushDrop.decode(script)
          const date = new Date(Utils.toUTF8(pushDrop.fields[0]))
          // ensure the date is from today
          if (date.toDateString() === new Date().toDateString()) {
            setHasPaid(true)
          }
        } 
      } catch (error) {
        console.error({ error })
      } finally {
        setLoading(false)
      }
    })()
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
        <TakePayment wallet={wallet}/>
      )}
    </ThemeContext.Provider>
  );
};

export default App;
