import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './layout/main.css'; // Import the CSS file
import { Game } from './components/Game';
import { Header } from './components/Header';
import { PushDrop, Script, Utils, WalletClient, PushDrop } from '@bsv/sdk';

const Home = () => {
    const date = new Date();
    const [hasPaid, setHasPaid] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const wallet = new WalletClient('auto', 'calendle.vercel.app');
    
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
            const script = Script.fromHex(response.outputs[0].lockingScript)
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

    const [statsDialogVisible, setStatsDialogVisible] = React.useState(false);
    
    if (loading) {
      return <div>Loading...</div>
    }

    if (hasPaid) {
      return (
        <>
            <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
            <Game key={date.toDateString()} setStatsDialogVisible={setStatsDialogVisible}/>
        </>
      )
    }
    
    return (
        <>
            <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
            <TakePayment wallet={wallet} />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
