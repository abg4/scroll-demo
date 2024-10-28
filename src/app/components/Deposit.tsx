"use client";

import React, { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { Network } from "../types";
import { networks, prettyUsdc, scrollConfig } from "../utils";
import styles from "./Deposit.module.css";
import { generateMessageForMulticallHandler, scaleUsdc } from "../utils";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import NetworkModal from "./NetworkModal";
import Tabs from "./Tabs";
import Position from "./Position";
import useBalance from "../hooks/useBalance";
import useAccountData from "../hooks/useAccountData";
import useAcrossClient from "../hooks/useAcrossClient";

const Deposit: React.FC = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(
    networks.find((network) => network.id === 42161) || null
  );

  const [displayAmount, setDisplayAmount] = useState("");
  const [rawAmount, setRawAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quote, setQuote] = useState<any | null>(null);

  const [depositTx, setDepositTxUrl] = useState<string>("");
  const [fillTx, setFillTxUrl] = useState<string>("");

  const [debouncedRawAmount, setDebouncedRawAmount] = useState(rawAmount);
  const [activeTab, setActiveTab] = useState<"deposit" | "position">("deposit");

  const { acrossClient, viemClient } = useAcrossClient(
    address,
    selectedNetwork
  );
  const { balance, isBalanceError, isBalanceLoading } = useBalance(
    address,
    selectedNetwork
  );
  const accountDataObject = useAccountData(address);

  useEffect(() => {
    const fetchQuote = async () => {
      if (selectedNetwork && rawAmount && address && acrossClient) {
        try {
          // Quote params used for quote request
          const route = {
            inputToken: selectedNetwork.usdcAddress as `0x${string}`,
            outputToken: scrollConfig.usdcAddress as `0x${string}`, // Assuming Ethereum as the destination chain
            originChainId: selectedNetwork.id, // Assuming USDC as the token
            destinationChainId: scrollConfig.id,
          };

          // Generates a message for the quote
          const message = generateMessageForMulticallHandler(
            BigInt(rawAmount),
            scrollConfig.usdcAddress,
            address
          );

          const quote = await acrossClient.getQuote({
            route,
            inputAmount: rawAmount.toString(),
            crossChainMessage: message,
          });

          if (!quote) {
            console.log("Issue with quote");
            return;
          }
          setQuote(quote);
        } catch (error) {
          console.error("Error fetching quote:", error);
          setQuote(null);
        }
      }
    };

    fetchQuote();
  }, [selectedNetwork, debouncedRawAmount, address]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRawAmount(rawAmount);
    }, 1000); // 1 second debounce

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or when rawAmount changes
    };
  }, [rawAmount]);

  const handleDeposit = async () => {
    try {
      if (!acrossClient || !viemClient) {
        console.log("No quote generated");
        return;
      }

      await acrossClient.executeQuote({
        deposit: quote.deposit,
        walletClient: viemClient,
        onProgress: (progress: any) => {
          if (progress.status === "txSuccess" && progress.step === "deposit") {
            const depositUrl = `${selectedNetwork?.blockExplorers?.default.url}/tx/${progress.txReceipt.transactionHash}`;
            setDepositTxUrl(depositUrl);
          }
          if (progress.status === "txSuccess" && progress.step === "fill") {
            const fillUrl = `${scrollConfig?.blockExplorers?.default.url}/tx/${progress.txReceipt.transactionHash}`;
            setFillTxUrl(fillUrl);
          }
        },
      });
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsModalOpen(false);
  };

  const handleDepositTx = () => {
    if (isWrongNetwork) {
      handleNetworkSwitch();
    } else {
      handleDeposit();
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      setRawAmount(balance.toString());
      setDisplayAmount(prettyUsdc(balance.toString(), 2));
    }
  };

  const handleNetworkSwitch = async () => {
    if (selectedNetwork) {
      try {
        switchChain({ chainId: selectedNetwork.id });
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  };

  const isWrongNetwork = selectedNetwork && chainId !== selectedNetwork.id;

  return (
    <div className={styles["network-selector"]}>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "deposit" && (
        <div>
          <div className={styles["input-group"]}>
            <label className={styles["input-label"]}>Source Chain</label>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`${styles["select-network-btn"]} ${styles["full-width"]} ${styles["flex-center"]}`} // Add flex-center class
            >
              {selectedNetwork ? (
                <>
                  <img
                    src={selectedNetwork.imgUrl}
                    alt={selectedNetwork.name}
                    className={`${styles["network-logo"]} ${styles["network-list-img"]}`} // Add a new class for consistent styling
                  />
                  <span>{selectedNetwork.name}</span>{" "}
                </>
              ) : (
                "Select Network"
              )}
            </button>
          </div>

          <div className={styles["input-group"]}>
            <div className={styles["label-balance-container"]}>
              <label className={styles["input-label"]}>Amount</label>
              <span className={styles["balance"]}>
                Balance:{" "}
                {isBalanceLoading || isBalanceError
                  ? "0"
                  : prettyUsdc(balance?.toString() || "0", 2)}{" "}
                USDC
              </span>
            </div>
            <div className={styles["input-max-container"]}>
              <input
                type="text"
                value={displayAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  const scaledValue = scaleUsdc(value).toString();
                  setDisplayAmount(value);
                  setRawAmount(scaledValue);
                }}
                placeholder="Enter amount"
                className={styles["amount-input"]}
              />
              <button
                onClick={handleMaxClick}
                className={styles["max-button"]}
                disabled={isBalanceLoading || isBalanceError || !balance}
              >
                Max
              </button>
            </div>
          </div>

          {quote && (
            <div className={styles["quote-info"]}>
              <div className={styles["quote-row"]}>
                <span className={styles["quote-label"]}>Estimated fee:</span>
                <span className={styles["quote-value"]}>
                  {prettyUsdc(quote.fees.totalRelayFee.total)} USDC
                </span>
              </div>
              <div className={styles["quote-row"]}>
                <span className={styles["quote-label"]}>Estimated time:</span>
                <span className={styles["quote-value"]}>
                  {quote.estimatedFillTimeSec} seconds
                </span>
              </div>
            </div>
          )}

          {isWrongNetwork ? (
            <button
              onClick={handleNetworkSwitch}
              className={`${styles["deposit-btn"]} ${styles["full-width"]}`}
            >
              Switch Network
            </button>
          ) : (
            <button
              onClick={handleDepositTx}
              className={`${styles["deposit-btn"]} ${styles["full-width"]}`}
              disabled={
                rawAmount === "" ||
                rawAmount === "0" ||
                (balance && BigNumber.from(rawAmount).gt(balance))
              }
            >
              {!address
                ? "Connect Wallet"
                : rawAmount === "" || rawAmount === "0"
                ? "Input Amount"
                : balance && BigNumber.from(rawAmount).gt(balance) // Check if rawAmount is greater than balance
                ? "Amount > Balance"
                : "Deposit"}
            </button>
          )}

          {(depositTx !== "" || fillTx !== "") && (
            <label className={styles["input-label"]}>Transaction Status</label>
          )}

          {depositTx && (
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <button
                onClick={() => window.open(depositTx, "_blank")}
                style={{
                  color: "white",
                  background: "transparent",
                  border: "2px solid white", // Add border
                  borderRadius: "5px", // Optional: rounded corners
                  padding: "10px 20px", // Add padding for better appearance
                  cursor: "pointer",
                  transition: "background 0.3s", // Optional: transition effect
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.1)")
                } // Change background on hover
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                } // Reset background on mouse leave
              >
                Deposit Tx
              </button>
            </div>
          )}

          {fillTx && (
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <button
                onClick={() => window.open(fillTx, "_blank")}
                style={{
                  color: "white",
                  background: "transparent",
                  border: "2px solid white", // Add border
                  borderRadius: "5px", // Optional: rounded corners
                  padding: "10px 20px", // Add padding for better appearance
                  cursor: "pointer",
                  transition: "background 0.3s", // Optional: transition effect
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.1)")
                } // Change background on hover
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                } // Reset background on mouse leave
              >
                Fill Tx
              </button>
            </div>
          )}

          <NetworkModal
            networks={networks}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleNetworkSelect}
          />
        </div>
      )}

      {activeTab === "position" && accountDataObject && (
        <Position accountData={accountDataObject} />
      )}
    </div>
  );
};

export default Deposit;
