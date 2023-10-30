import React, { useState, useRef } from "react";
import "./gooday.css";
import { chainid } from "./constant";
import { ethers } from "ethers";
import { getGraph } from "./hooks/NextId";
import {
  createNewFlow,
  deleteExistingFlow,
  GetFlow,
  UpdateFlow,
} from "./Superfluid";
import { CheckChain, changeEthereumChain, connectToMetaMask } from "./MetaMask";

type Account = {
  signer: ethers.providers.JsonRpcSigner;
  providers: ethers.providers.JsonRpcProvider;
  address: string;
};

// Main function
export const GooDay = () => {
  //  states of function

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [AccountInfo, setAccountInfo] = useState<Account>();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [PayAdd, setPayAdd] = useState("");
  const [updateFlag, setUpadateFlag] = useState(false);
  const [flowR, setFlowR] = useState("");
  const [flowRateFlag, setFlowRateFlag] = useState(false);
  // input variables
  const reciverId = useRef("");
  const FlowRate = useRef("");

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleConnect = async () => {
    const network = await CheckChain();

    const user = await connectToMetaMask();
    setAccountInfo(user);

    if (network != chainid) {
      await changeEthereumChain();
    }
    setIsConnected(true);
  };

  const handleCheck = async () => {
    try {
      if (reciverId.current == "") {
        alert("pelase enter revicer address or id ");
        return;
      } else if (selectedOption == "") {
        console.log(selectedOption);
        alert("please enter  plateform id ");
        return;
      } else if (FlowRate.current == "") {
        alert("please Enter flow Rate");
        return;
      } else if (selectedOption == "eao") {
        if (reciverId.current.length != 42) {
          alert("please enter correct address");
        } else {
          setPayAdd(reciverId.current);
          const check: any = await GetFlow(reciverId.current);
          console.log(check.flowRate);

          setFlowRateFlag(true);

          if (check.flowRate === "0") {
            setUpadateFlag(false);
            setFlowRateFlag(true);
            return;
          } else {
            setFlowR(check.flowRate);
            setUpadateFlag(true);
            setFlowRateFlag(true);
          }
        }
      } else {
        const reciver = await getGraph(selectedOption, reciverId.current);
        setPayAdd(reciver);
        const check: any = await GetFlow(reciver);
        console.log(check.flowRate);
        if (check.flowRate === "0") {
          setUpadateFlag(false);
          setFlowRateFlag(true);
          return;
        } else {
          setFlowR(check.flowRate);
          setUpadateFlag(true);
          setFlowRateFlag(true);
        }
      }
    } catch (e) {
      console.log(e);
      alert("please enter Correct platform and id ");
    }
  };

  return (
    <div>
      <div>
        <div>
          <button onClick={openModal}>Open Modal</button>

          <div
            className="card"
            style={{ display: isModalOpen ? "block" : "none" }}
          >
            <button className="dismiss" onClick={closeModal} type="button">
              ×
            </button>
            <div className="header">
              <div className="content">
                <span className="title"> STREM G$ TO ANY ONE</span>
              </div>
              <div>
                {isConnected ? (
                  <div>{`${AccountInfo?.address.slice(
                    0,
                    4
                  )}...${AccountInfo?.address.slice(
                    AccountInfo.address.length - 4,
                    AccountInfo.address.length
                  )}`}</div>
                ) : (
                  <button
                    onClick={() => {
                      handleConnect();
                    }}
                  >
                    Connect
                  </button>
                )}
              </div>

              <div className="actions">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    {" "}
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
                    <select
                      className="selectplatform"
                      defaultValue={"none"}
                      id="selectOption"
                      onChange={handleOptionChange}
                    >
                      <option value="none">Select</option>
                      <option value="twitter">twitter</option>
                      <option value="lens">lens</option>
                      <option value="eao">EOA</option>
                      <option value="dotbit">dotbit</option>
                      <option value="ens">ENS</option>
                      <option value="farcaster">FarCaster</option>
                    </select>
                  </div>
                </div>
                <div>
                  {" "}
                  Enter FlowRate (G$/month)
                  <input
                    className="search"
                    onChange={(e) => {
                      FlowRate.current = e.target.value;
                      console.log(FlowRate.current);
                    }}
                  />
                </div>
                {PayAdd != "" && <div>Reciver = {PayAdd}</div>}
                {!flowRateFlag ? (
                  <button
                    className="track"
                    onClick={() => {
                      handleCheck();
                    }}
                    type="button"
                  >
                    Check data
                  </button>
                ) : (
                  <>
                    {!updateFlag ? (
                      <>
                        <div>
                          You don't have any running stream please create one
                        </div>
                        <button
                          className="track"
                          onClick={() => {
                            createNewFlow(PayAdd, FlowRate.current);
                          }}
                          type="button"
                        >
                          Create New Flow
                        </button>
                      </>
                    ) : (
                      <>
                        <div>You already have a flow of flowRate : {flowR}</div>
                        <button
                          className="track"
                          onClick={() => {
                            deleteExistingFlow(PayAdd);
                          }}
                          type="button"
                        >
                          Delete FLow
                        </button>
                        <button
                          className="track"
                          onClick={() => {
                            UpdateFlow(PayAdd, FlowRate.current);
                          }}
                          type="button"
                        >
                          Update Flow
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

///css for this page
