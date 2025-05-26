import { KeyDeriver, PrivateKey } from '@bsv/sdk'
import { StorageClient, Wallet, WalletSigner, WalletStorageManager, Services } from '@bsv/wallet-toolbox-client'

const serverPrivateKey = process.env.SERVER_PRIVATE_KEY

async function makeWallet (
    chain,
    storageURL,
    privateKey
  ) {
    const keyDeriver = new KeyDeriver(new PrivateKey(privateKey, 'hex'))
    const storageManager = new WalletStorageManager(keyDeriver.identityKey)
    const signer = new WalletSigner(chain, keyDeriver, storageManager)
    const services = new Services(chain)
    const wallet = new Wallet(signer, services)
    const client = new StorageClient(
      wallet,
      storageURL
    )
    await client.makeAvailable()
    await wallet.storage.addWalletStorageProvider(client)
  
    return wallet
  }

export default async function savePayment(req, res) {
    const wallet = await makeWallet('main', 'https://storage.babbage.systems', serverPrivateKey)
    await wallet.isAuthenticated()
    const data = req.body
    const response = await wallet.internalizeAction({
        tx: data.tx,
        description: 'Calendle Payment',
        outputs: data.outputs,
        labels: ['calendle']
    })
    res.json(response)
}   