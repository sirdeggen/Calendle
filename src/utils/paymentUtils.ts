import { Utils, Transaction } from '@bsv/sdk';

/**
 * Checks if the user has a valid token for today's game
 * @param tx The transaction object returned from payment
 * @returns Promise<boolean> Whether the user has paid for today's game
 */
export const checkPaymentStatus = async (tx: Transaction, vout: string): Promise<boolean> => {
  try {
    const outputIndex = parseInt(vout);
    const valid = await tx.verify()
    if (!valid) {
      console.error('SPV verification failed');
      return false;
    }
    const lockingScript = tx.outputs[outputIndex].lockingScript;
  
    console.log({ lockingScript });
    const date = new Date(Utils.toUTF8(lockingScript.chunks[0].data ?? []));
    console.log({ date });
    
    // ensure the date is from today
    console.log({ today: new Date().toDateString(), date: date.toDateString() })
    return date.toDateString() === new Date().toDateString();
  } catch (error) {
    console.error({ error });
    return false;
  }
};
