"use client";

import React, { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { Network, QuoteResponse, QuoteParams } from "../types";
import {
  networks,
  getQuote,
  prettyUsdc,
  scrollConfig,
  prettyAddress,
} from "../utils";
import styles from "./Deposit.module.css";
import {
  generateMessageForMulticallHandler,
  erc20Abi,
  spokePoolAbi,
  scaleUsdc,
} from "../utils";
import {
  useAccount,
  useWriteContract,
  useChainId,
  useSwitchChain,
} from "wagmi";
import NetworkModal from "./NetworkModal";
import Tabs from "./Tabs";
import Position from "./Position";
import useAllowance from "../hooks/useAllowance";
import useBalance from "../hooks/useBalance";
import useAccountData from "../hooks/useAccountData";

const Deposit: React.FC = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: hash, writeContract } = useWriteContract();
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(
    networks.find((network) => network.chainId === 42161) || null
  );

  const [displayAmount, setDisplayAmount] = useState("");
  const [rawAmount, setRawAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [debouncedRawAmount, setDebouncedRawAmount] = useState(rawAmount);
  const [activeTab, setActiveTab] = useState<"deposit" | "position">("deposit");

  const { needsApproval } = useAllowance(address, selectedNetwork, rawAmount);
  const { balance, isBalanceError, isBalanceLoading } = useBalance(
    address,
    selectedNetwork
  );
  const accountDataObject = useAccountData(address);

  useEffect(() => {
    const fetchQuote = async () => {
      if (selectedNetwork && rawAmount && address) {
        try {
          // Generates a message for the quote
          const message = generateMessageForMulticallHandler(
            rawAmount,
            scrollConfig.usdcAddress,
            address
          );

          // Quote params used for API request
          const quoteParams: QuoteParams = {
            inputToken: selectedNetwork.usdcAddress,
            outputToken: scrollConfig.usdcAddress, // Assuming Ethereum as the destination chain
            originChainId: selectedNetwork.chainId, // Assuming USDC as the token
            destinationChainId: scrollConfig.chainId,
            amount: rawAmount.toString(),
            recipient: scrollConfig.multicallHandler,
            message,
          };
          const quoteResponse = await getQuote(quoteParams);
          if (!quoteResponse) {
            console.log("Issue with quote");
            return;
          }
          setQuote(quoteResponse);
        } catch (error) {
          console.error("Error fetching quote:", error);
          setQuote(null);
        }
      } else {
        setQuote(null);
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
      if (!quote) {
        console.log("No quote generated");
        return;
      }
      const outputAmount = BigNumber.from(rawAmount).sub(
        quote?.totalRelayFee?.total || 0
      );

      const message = generateMessageForMulticallHandler(
        outputAmount.toString(),
        scrollConfig.usdcAddress,
        address as `0x${string}`
      );

      const fillDeadlineBuffer = 18000;
      const fillDeadline = Math.round(Date.now() / 1000) + fillDeadlineBuffer;
      
      // See Across docs for explanation on each arg
      // https://docs.across.to/reference/selected-contract-functions
      const args = [
        address, // depositor
        scrollConfig.multicallHandler, // recipient
        selectedNetwork?.usdcAddress, // inputToken
        scrollConfig.usdcAddress, // outputToken
        rawAmount.toString(), // inputAmount
        outputAmount.toString(), // outputAmount
        scrollConfig.chainId, // destination chainId
        quote?.exclusiveRelayer, // exclusive relayer
        quote?.timestamp, // quote timestamp
        fillDeadline, // fill deadline
        quote?.exclusivityDeadline, // exclusivityDeadline 
        message, // message
      ];

      writeContract({
        address: selectedNetwork?.spokePoolAddress as `0x${string}`,
        abi: spokePoolAbi,
        functionName: "depositV3",
        args,
      });
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsModalOpen(false);
  };

  const handleApprove = async () => {
    if (!selectedNetwork || !rawAmount) return;
    setIsApproving(true);
    try {
      writeContract({
        address: selectedNetwork.usdcAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [selectedNetwork.spokePoolAddress, BigNumber.from(rawAmount)],
      });
    } catch (error) {
      console.error("Error approving token:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleApproveOrDeposit = () => {
    if (isWrongNetwork) {
      handleNetworkSwitch();
    } else if (needsApproval) {
      handleApprove();
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
        await switchChain({ chainId: selectedNetwork.chainId });
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  };

  const isWrongNetwork = selectedNetwork && chainId !== selectedNetwork.chainId;

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
                  {prettyUsdc(quote.totalRelayFee.total)} USDC
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

          <button
            onClick={handleApproveOrDeposit}
            className={`${styles["deposit-btn"]} ${styles["full-width"]}`}
            disabled={
              !selectedNetwork ||
              rawAmount === "" ||
              rawAmount === "0" ||
              (balance && BigNumber.from(rawAmount).gt(balance))
            }
          >
            {!address
              ? "Connect Wallet"
              : isWrongNetwork
              ? "Switch Network"
              : rawAmount === "" || rawAmount === "0"
              ? "Input Amount"
              : balance && BigNumber.from(rawAmount).gt(balance) // Check if rawAmount is greater than balance
              ? "Amount > Balance"
              : needsApproval
              ? isApproving
                ? "Approving..."
                : "Approve"
              : "Deposit"}
          </button>

          {hash && selectedNetwork?.explorerUrl && (
            <div>
              Transaction Hash:{" "}
              <a
                href={`${selectedNetwork.explorerUrl}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white", textDecoration: "underline" }}
              >
                {prettyAddress(hash)}
              </a>
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
