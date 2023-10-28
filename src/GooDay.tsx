import React, { useState, useEffect, useRef } from 'react';
import './gooday.css';
import { ethers } from 'ethers';
import { createNewFlow } from './Superfluid';
import { Framework } from '@superfluid-finance/sdk-core';
interface Account {
  signer: ethers.providers.JsonRpcSigner;
  providers: ethers.providers.JsonRpcProvider;
  address: string;
}
export function GooDay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [AccountInfo, setAccountInfo] = useState<Account>();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const reciverId = useRef('');
  const recierPlatform = useRef('');

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //where the Superfluid logic takes place
  async function deleteExistingFlow(recipient: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = provider.getSigner();

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });

    const superSigner = sf.createSigner({ signer: signer });

    console.log(signer);
    console.log(await superSigner.getAddress());
    const daix = await sf.loadSuperToken('fDAIx');

    console.log(daix);

    try {
      const deleteFlowOperation = daix.deleteFlow({
        sender: await signer.getAddress(),
        receiver: recipient
        // userData?: string
      });

      console.log(deleteFlowOperation);
      console.log('Deleting your stream...');

      const result = await deleteFlowOperation.exec(superSigner);
      console.log(result);

      console.log(
        `Congrats - you've just updated a money stream!
    `
      );
    } catch (error) {
      console.log("Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!");
      console.error(error);
    }
  }

  async function changeEthereumChain() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881', // Chain ID for Celo
              chainName: 'Mumbai',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/']
            }
            // Add more chain configurations here as needed
          ]
        });
      } else {
        console.error('MetaMask is not installed or not accessible.');
      }
    } catch (error) {
      console.error('Failed to change Ethereum chain:', error);
    }
  }
  // useEffect(() => {
  //   connectToMetaMask();
  // }, [isConnected]);

  const connectToMetaMask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const networkId = await window.ethereum.request({ method: 'net_version' });

        if (networkId === '80001') {
          setIsConnected(true);

          try {
            const providers = new ethers.providers.Web3Provider(window.ethereum);

            const signer: ethers.providers.JsonRpcSigner = await providers.getSigner();
            const address = await signer.getAddress();
            const user = {
              providers,
              signer,
              address
            };

            setAccountInfo(user);
            if (networkId != '80001') {
              changeEthereumChain();
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          console.error('Not connected to Ethereum mainnet');
        }
      } else {
        console.error('MetaMask is not installed or not accessible.');
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      <div>
        <div>
          <button onClick={openModal}>Open Modal</button>

          <div className="card" style={{ display: isModalOpen ? 'block' : 'none' }}>
            <button className="dismiss" onClick={closeModal} type="button">
              ×
            </button>
            <div className="header">
              <div className="content">
                <span className="title"> STREM G$ TO ANY ONE</span>
              </div>
              <div>
                {isConnected ? (
                  <div>{`${AccountInfo?.address.slice(0, 4)}...${AccountInfo?.address.slice(AccountInfo.address.length - 4, AccountInfo.address.length)}`}</div>
                ) : (
                  <button onClick={connectToMetaMask}>Connect</button>
                )}
              </div>

              <div className="actions">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                  }}
                >
                  <div>
                    {' '}
                    Enter Reciver
                    <input
                      className="search"
                      onChange={(e) => {
                        reciverId.current = e.target.value;
                        console.log(reciverId.current);
                      }}
                    />
                  </div>
                  <div>
                    select Platform
                    <select className="selectplatform" name="" id="">
                      <option value="">twitter</option>
                      <option value="">lens</option>
                      <option value="">Address</option>
                      <option value="">dot bit</option>
                    </select>
                  </div>
                </div>

                <button
                  className="track"
                  onClick={() => {
                    createNewFlow(reciverId.current, '100');
                  }}
                  type="button"
                >
                  PAY
                </button>
                <button
                  className="track"
                  onClick={() => {
                    deleteExistingFlow(reciverId.current);
                  }}
                  type="button"
                >
                  DELET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
