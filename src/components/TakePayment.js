import { PushDrop, PublicKey, Utils, P2PKH } from '@bsv/sdk';
import { ScriptTemplateBRC29 } from '@bsv/wallet-toolbox-client';

const serverIdentityKey = '0329dd62d6c5f4cbedd8c99d0120da743250815a15f1308fd6f549a15af4c5fd7f';

export default function TakePayment({ wallet }) {
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
        const payment = await wallet.createAction({
            description: 'Calendle Payment',
            labels: ['calendle'],
            outputs: [
                {
                    basket: 'calendle',
                    satoshis: 1,
                    lockingScript: new PushDrop().lock([[Utils.toArray(new Date().toUTCString(), 'utf8')]]),
                    outputDescription: 'Calendle Game Token'
                },
                {
                    lockingScript: paymentScript,
                    satoshis: 125000,
                    outputDescription: 'Calendle Payment'
                }
            ],
            randomizeOutputs: false
        })
        console.log(payment)
        const response = await (await fetch('/api/savePayment', {
            method: 'POST',
            body: JSON.stringify({
                tx: payment.tx,
                outputs
            })
        })).json()
        console.log(response)
    }
    return (
        <div>
            <h1>Pay 125k sats to continue</h1>
            <button onClick={pay}>Pay</button>
        </div>
    )
}