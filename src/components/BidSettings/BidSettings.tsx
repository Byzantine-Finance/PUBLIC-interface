// src/components/BidSettings.tsx
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { byzETHabi, byzETHaddress } from "@/ABI/byzETH";

import { ethers } from "ethers";
import { formatEther, parseEther } from "viem";

import { useAccount, useBalance, useChainId, useEnsName } from "wagmi";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";

import styles from "./BidSettings.module.scss";

import ByzantineLogo from "@/assets/byzantineLogo.png";
import SparklesIcon from "@/assets/sparkles.svg";
import SwitchArrows from "@/assets/switchArrows.svg";
import Ethereum from "@/assets/ethereum.png";

const RATIO = 1; // 1 ETH = 0.9934 byzETH

const BidSettings: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const chainId = useChainId();
  const [restaking, setRestaking] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("0");
  const [contractBalanceKey, setContractBalanceKey] = useState(0);

  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      pollingInterval: 500,
    });
  const { data: balanceETH } = useBalance({
    address: address,
    // watch: true,
  });
  const { data: contractBalance } = useReadContract({
    address: byzETHaddress,
    abi: byzETHabi,
    functionName: "balanceOf",
    args: [address],
  });
  // console.log(contractBalance ? ethers.formatEther(contractBalance) : "");
  //   const { addressW, setAddressW } = useState();

  useEffect(() => {
    console.log("balanceETH");
    console.log(balanceETH);
  }, [balanceETH]);
  useEffect(() => {
    console.log("contractBalance");
    console.log(contractBalance);
  }, [contractBalance]);

  //   console.log(resBalance);

  function handleSwitchRestaking() {
    setRestaking(!restaking);
  }

  function handleClickOnMax() {
    // Set the input value to the max balance available
    const maxBalance = balanceETH?.formatted || "0";
    setInputValue(
      restaking
        ? maxBalance
        : contractBalance
        ? formatEther(contractBalance as bigint)
        : ""
    );
  }

  async function mintByzETH() {
    console.log("Attempting to restake...");
    try {
      console.log("Sending the tx: ");
      const tx = await writeContract({
        address: byzETHaddress,
        abi: byzETHabi,
        functionName: "depositETH",
        value: parseEther(inputValue),
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  }

  async function withdrawETH() {
    console.log("Attempting to withdraw...");
    try {
      console.log("Sending the tx: ");
      const tx = await writeContract({
        address: byzETHaddress,
        abi: byzETHabi,
        functionName: "withdrawETH",
        args: [parseEther(inputValue)],
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // For the slider, directly set its value to inputValue
    setInputValue(newValue);
  };

  // Render
  return (
    <div className={styles.restakeApp}>
      <div className={styles.boxApp}>
        <div className={styles.nameBox}>Solo restake</div>
        <div className={styles.contentBox}>
          <div className={styles.firstBox}>
            <div className={styles.firstLeftBox}>Balance: 32.6106145</div>
            <div className={styles.firstRightBox}>{inputValue} ETH</div>
          </div>
          <div className={styles.secondBox}>
            <input
              type="range"
              min="32" // The minimum value (1 ETH as a starting point, adjust as needed)
              max="320" // The maximum value (10 ETH for example, adjust as needed)
              step="32" // Increment in multiples of 32
              value={inputValue} // Bind the slider value to the inputValue state
              className={styles.slider}
              id="myRange"
              onChange={handleChange} // Use the existing handleChange to update the inputValue
            />
          </div>
        </div>
      </div>
      <div className={styles.descApp}>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>Reward rate</div>
          <div className={`${styles.resDesc} ${styles.sparkles}`}>3.9%</div>
        </div>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>Validator activation</div>
          <div className={styles.resDesc}>~0.4 days</div>
        </div>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>Validator exit</div>
          <div className={styles.resDesc}>0 to 8 days</div>
        </div>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>Service fees</div>
          <div className={styles.resDesc}>8%</div>
        </div>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>Transaction fee</div>
          <div className={styles.resDesc}>~ $32</div>
        </div>
      </div>
      <>
        {!isConnected ? (
          <button
            className={styles.connectBtn}
            onClick={() => setShowAuthFlow(true)}
          >
            Connect
          </button>
        ) : parseFloat(inputValue) > 0 ? (
          isPending ? (
            <button
              disabled
              className={`${styles.connectBtn} ${styles.pending}`}
            >
              ...
            </button>
          ) : restaking ? (
            <button className={styles.connectBtn} onClick={mintByzETH}>
              Restake
            </button>
          ) : (
            <button className={styles.connectBtn} onClick={withdrawETH}>
              Withdraw
            </button>
          )
        ) : (
          <button className={`${styles.connectBtn} ${styles.insert}`}>
            Select an amount
          </button>
        )}
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </>
    </div>
  );
};

export default BidSettings;