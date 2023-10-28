import { Framework, ISuperTokenCreateFlowParams } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';
export async function createNewFlow(recipient: string, flowRate: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);

  const signer = await provider.getSigner();
  const sf = await Framework.create({
    chainId: 80001,
    provider: provider
  });
  const superSigner = sf.createSigner({ signer: signer });
  const daix = await sf.loadSuperToken('fDAIx');

  console.log(daix);

  try {
    const createFlowOperation = daix.createFlow({
      sender: await superSigner.getAddress(),
      receiver: recipient,
      flowRate: flowRate
      // userData?: string
    });

    console.log(createFlowOperation);
    console.log('Creating your stream...');

    const result = await createFlowOperation.exec(superSigner);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
      `
    );
  } catch (error) {
    console.log("Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!");
    console.error(error);
  }
}
