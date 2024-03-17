// src/components/LiquidRestake.tsx
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { RATIO, ETH_PRICE } from "@/contexts/ContextProvider";
import { Tooltip } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useUser } from "@/contexts/ContextProvider";

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

import styles from "./LiquidRestake.module.scss";

import ByzantineLogo from "@/assets/byzantineLogo.png";
import SparklesIcon from "@/assets/sparkles.svg";
import SwitchArrows from "@/assets/switchArrows.svg";
import Ethereum from "@/assets/ethereum.png";

// const RATIO = 1; // 1 ETH = 0.9934 byzETH
// const ETH_PRICE = 3891.4522521;

const LiquidRestake: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const chainId = useChainId();
  const [restaking, setRestaking] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [contractBalanceKey, setContractBalanceKey] = useState(0);
  const { showAnimation } = useUser();

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
  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(
        <div>
          Transaction failed:{" "}
          {(error as BaseError).shortMessage || error.message}
        </div>,
        { autoClose: 4000 }
      );
    }
  }, [error]);
  useEffect(() => {
    if (isConfirmed && address) {
      console.log(isConfirmed);
      console.log(address);
      toast.success(
        <div className="confirmedTransaction">
          Transaction confirmed!
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
        </div>
      );
    }
  }, [isConfirmed]);

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

  // Handle change for the input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Calculate the converted value based on the ratio and restaking status
  const getConvertedValue = (): string => {
    if (!inputValue) return "";
    const value = parseFloat(inputValue);
    return restaking ? (value * RATIO).toString() : (value / RATIO).toString();
  };

  // Render
  return (
    <div className={styles.restakeApp}>
      <div className={styles.boxApp}>
        <div className={styles.nameBox}>
          {restaking ? "Restake" : "Withdraw"}
        </div>
        <div className={styles.contentBox}>
          <div className={styles.leftBox}>
            <div>
              <input
                type="text"
                placeholder="0"
                value={inputValue}
                onChange={handleChange}
              />
              <div className={styles.priceEth}>
                {inputValue &&
                  "$" + (Number(inputValue) * ETH_PRICE).toFixed(2)}
              </div>
            </div>
            <button className={styles.maxBtnBox} onClick={handleClickOnMax}>
              MAX
            </button>
          </div>
          <div className={styles.rightBox}>
            <div className={styles.firstLineRightBox}>
              <div className={styles.imgToken}>
                <Image
                  src={Ethereum}
                  width={32}
                  height={32}
                  alt="Button to switch assets from ETH and byzETH"
                />
              </div>
              <div className={styles.nameToken}>
                {restaking ? "ETH" : "byzETH"}
              </div>
            </div>
            <div className={styles.balance}>
              Balance:{" "}
              {isConnected
                ? restaking
                  ? balanceETH?.formatted.slice(0, 8)
                  : formatEther((contractBalance || 0) as bigint)
                : "..."}
            </div>
          </div>
        </div>
      </div>
      <button className={styles.swapBtn} onClick={handleSwitchRestaking}>
        <Image
          src={SwitchArrows}
          width={20}
          height={20}
          alt="Button to switch assets from ETH and byzETH"
          className={`${restaking ? styles.withdraw : ""}`}
        />
        {/* <SwitchArrows /> */}
      </button>
      <div className={styles.boxApp}>
        <div className={styles.nameBox}>Receive</div>
        <div className={styles.contentBox}>
          <div className={styles.leftBox}>
            <div>
              <input
                type="text"
                placeholder="0"
                value={getConvertedValue()}
                onChange={handleChange}
              />
              <div className={styles.priceEth}>
                {inputValue &&
                  "$" + (Number(inputValue) * ETH_PRICE).toFixed(2)}
              </div>
            </div>
            {/* {resBalance} */}
            {/* <button className={styles.maxBtnBox}>MAX</button> */}
          </div>
          <div className={styles.rightBox}>
            <div className={styles.firstLineRightBox}>
              <div className={styles.imgToken}>
                <Image
                  src={Ethereum}
                  width={32}
                  height={32}
                  alt="Button to switch assets from ETH and byzETH"
                />
              </div>
              <div className={styles.nameToken}>
                {restaking ? "byzETH" : "ETH"}
              </div>
            </div>
            <div className={styles.balance}>
              Balance:{" "}
              {isConnected
                ? !restaking
                  ? balanceETH?.formatted.slice(0, 8)
                  : formatEther((contractBalance || 0) as bigint)
                : "..."}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.descApp}>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>
            <div>Reward rate</div>
            <Tooltip
              content={
                <div className="tooltip">
                  Average protocol reward rate over the past 30 days
                </div>
              }
            >
              <div className={styles.info}>i</div>
            </Tooltip>
          </div>
          <div className={`${styles.resDesc} ${styles.sparkles}`}>
            <Image
              src={SparklesIcon}
              className={styles.logoClariFi}
              alt="Logo of ClariFi"
            />
            <div>3.9%</div>
          </div>
        </div>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>
            <div>Exchange rate</div>
            <Tooltip
              content={
                <div className="tooltip">
                  The current exchange rate of byzETH. This ratio will increase
                  over time, representing the revenue.
                </div>
              }
            >
              <div className={styles.info}>i</div>
            </Tooltip>
          </div>
          <div className={styles.resDesc}>1 ETH : {RATIO} byzETH</div>
        </div>
        <div className={styles.lineDesc}>
          <div className={styles.titleDesc}>
            <div>Gas fee</div>
          </div>
          <div className={styles.resDesc}>~ $32</div>
        </div>
      </div>
      <>
        {!isConnected ? (
          <button
            // className={styles.connectBtn}
            className={`${styles.connectBtn} ${
              showAnimation && "shakeAnimation"
            }`}
            id="invincible"
            onClick={() => setShowAuthFlow(true)}
            // onClick={() => toast( "Oups, you need to connect first!")}
            // onClick={() => toast( "Oups, you need to connect first!")}
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
            Insert an amount
          </button>
        )}
        {/* {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>} */}
      </>
    </div>
  );
};

export default LiquidRestake;
