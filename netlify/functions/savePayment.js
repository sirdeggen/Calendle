const { KeyDeriver, PrivateKey } = require('@bsv/sdk');
const { StorageClient, Wallet, WalletSigner, WalletStorageManager, Services } = require('@bsv/wallet-toolbox-client');

const serverPrivateKey = process.env.SERVER_PRIVATE_KEY ?? '';

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

exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    const { tx, outputs } = body;

    if (!tx || !outputs) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    console.log({ outputs: body.outputs, serverPrivateKey })

    // Your payment processing logic here
    // For example, saving to database, confirming transaction, etc.
    // This would use the makeWallet function and the serverPrivateKey

    // Process payment using the existing makeWallet function
    const wallet = await makeWallet('main', 'https://storage.babbage.systems', serverPrivateKey)
    await wallet.isAuthenticated({}, 'calendle.co')
    const response = await wallet.internalizeAction({
        tx: body.tx,
        description: 'Calendle Payment',
        outputs: body.outputs,
        labels: ['calendle']
    })
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};
