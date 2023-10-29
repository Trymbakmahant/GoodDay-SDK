import { ethers } from 'ethers';

export const connectToMetaMask = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const networkId = await window.ethereum.request({ method: 'net_version' });
      console.log(networkId);

      try {
        const providers = new ethers.providers.Web3Provider(window.ethereum);

        const signer: ethers.providers.JsonRpcSigner = await providers.getSigner();
        const address = await signer.getAddress();
        const user = {
          providers,
          signer,
          address
        };

        return user;
        changeEthereumChain();
      } catch (e) {
        console.log(e);
      }
    } else {
      console.error('MetaMask is not installed or not accessible.');
    }
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

export async function changeEthereumChain() {
  try {
    await connectToMetaMask();
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }]
      });
    } else {
      console.error('MetaMask is not installed or not accessible.');
    }
  } catch (error) {
    console.error('Failed to change Ethereum chain:', error);
  }
}

export const CheckChain = async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const networkId = await window.ethereum.request({ method: 'net_version' });
    console.log(networkId);
    return networkId;
  } else {
    console.log('install metamask ');
  }
};
