import React, { useState } from 'react';
import { PushDrop, PublicKey, Utils, P2PKH, Random, Beef, Transaction } from '@bsv/sdk';
import { checkPaymentStatus } from '../utils/paymentUtils';

const serverIdentityKey = '0329dd62d6c5f4cbedd8c99d0120da743250815a15f1308fd6f549a15af4c5fd7f';

const styles = {
    container: {
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        minHeight: '50vh',
        maxWidth: '100%'
    },
    heading: {
        fontSize: '1.8rem',
        marginBottom: '2rem',
        color: '#333',
        fontWeight: 'bold' as const
    },
    button: {
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 2rem',
        fontSize: '1.2rem',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        width: '80%',
        maxWidth: '320px'
    },
    buttonHover: {
        backgroundColor: '#3a7bc8',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
    }
}

interface TakePaymentProps {
    wallet: any;
    setHasPaid?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TakePayment({ wallet, setHasPaid }: TakePaymentProps) {
    const pay = async () => {
        const { publicKey: senderIdentityKey } = await wallet.getPublicKey({ identityKey: true })
        const derivationPrefix = Utils.toBase64(Random(8))
        const derivationSuffix = Utils.toBase64(Random(8))
        const outputs = [{
            protocol: 'wallet payment',
            outputIndex: 1,
            paymentRemittance: {
                derivationPrefix,
                derivationSuffix,
                senderIdentityKey
            }
        }]
        const { publicKey: paymentKey } = await wallet.getPublicKey({ 
            protocolID: [2, '3241645161d8'], // brc29
            keyID: `${derivationPrefix} ${derivationSuffix}`,
            counterparty: serverIdentityKey
        })
        const paymentScript = new P2PKH().lock(PublicKey.fromString(paymentKey).toAddress()).toHex()
        const pd = new PushDrop(wallet, 'calendle.co')
        const tokenLockingScript = await pd.lock(
            [Utils.toArray(new Date().toUTCString(), 'utf8')],
            [2, 'calendle'],
            '1',
            'self',
            true,
            true,
            'after'
        )
        const payment = await wallet.createAction({
            description: 'Calendle Payment',
            labels: ['calendle'],
            outputs: [
                {
                    basket: 'calendle',
                    satoshis: 1,
                    lockingScript: tokenLockingScript.toHex(),
                    outputDescription: 'Calendle Game Token'
                },
                {
                    lockingScript: paymentScript,
                    satoshis: 12500,
                    outputDescription: 'Calendle Payment'
                }
            ],
            options: {
                randomizeOutputs: false
            }
        })
        console.log(payment)
    

        const beef = Beef.fromBinary(payment.tx)
        const tx = beef.findAtomicTransaction(payment.txid) as Transaction;

        // re-get the tokens and unlock the game
        const isPaid = await checkPaymentStatus(tx, '0');
        
        // If setHasPaid is provided (from parent component), update the payment status
        if (setHasPaid && isPaid) {
            setHasPaid(true);
        }

        // In development, this will be proxied to /.netlify/functions/savePayment via Vite config
        // In production, Netlify will handle redirecting /api/savePayment to the function
        const response = await (await fetch('/api/savePayment', {
            method: 'POST',
            body: JSON.stringify({
                tx: payment.tx,
                outputs
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json()

        console.log({ response })
        
        return isPaid;
    }
    
    return (
        <div style={styles.container}>
            <p>A puzzle game where you must place shapes on a grid to match the target shape.<br />
            Each day is a new puzzle. Pay using BSV using <a href="https://metanet.bsvb.tech" target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>Metanet Desktop</a> to unlock today's puzzle.</p>
            <br />
            <button 
                onClick={pay}
                style={{ 
                    ...styles.button,
                }}
            >
                Pay 12.5k sats to Play Today
            </button>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#888' }}>~0.5¢</div>
        </div>
    )
}
