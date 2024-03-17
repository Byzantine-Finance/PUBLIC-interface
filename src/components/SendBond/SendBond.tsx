// src/components/SendBond.tsx
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { RATIO, useUser } from "@/contexts/ContextProvider";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { auctionAddress, auctionABI } from "@/ABI/auctionSystem";

import { ethers } from "ethers";
import { formatEther, parseEther } from "viem";

import { useAccount, useBalance, useChainId, useEnsName } from "wagmi";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";

import styles from "./SendBond.module.scss";

import ByzantineLogo from "@/assets/byzantineLogo.png";
import SparklesIcon from "@/assets/sparkles.svg";
import SwitchArrows from "@/assets/switchArrows.svg";
import Ethereum from "@/assets/ethereum.png";

const SendBond: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const { showAnimation } = useUser();

  const chainId = useChainId();
  const [restaking, setRestaking] = useState<boolean>(true);
  const { data: bondAmount } = useReadContract({
    address: auctionAddress,
    abi: auctionABI,
    functionName: "operatorBond",
  });

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
  useEffect(() => {
    console.log("bondAmount");
    console.log(bondAmount);
  }, [bondAmount]);
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

  async function bond1ETH() {
    console.log("Attempting to bond 1 ETH...");
    try {
      console.log("Sending the tx: ");
      const tx = await writeContract({
        address: auctionAddress,
        abi: auctionABI,
        functionName: "joinProtocol",
        value: bondAmount as bigint,
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  }

  // Render
  return (
    <div className={styles.restakeApp}>
      <div className={styles.boxApp}>
        {/* <div className={styles.nameBox}>
          {restaking ? "Restake" : "Withdraw"}
        </div> */}
        <div className={styles.contentBox}>
          <div className={styles.leftBox}>
            {bondAmount ? formatEther(bondAmount as bigint) : "..."}
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
              <div className={styles.nameToken}>ETH</div>
            </div>
            <div className={styles.balance}>
              Balance: {isConnected ? balanceETH?.formatted.slice(0, 8) : "..."}
            </div>
          </div>
        </div>
      </div>
      <>
        {!isConnected ? (
          <button
            className={`${styles.connectBtn} ${
              showAnimation && "shakeAnimation"
            }`}
            id="invincible"
            onClick={() => setShowAuthFlow(true)}
          >
            Connect
          </button>
        ) : isPending ? (
          <button disabled className={`${styles.connectBtn} ${styles.pending}`}>
            ...
          </button>
        ) : (
          <button className={styles.connectBtn} onClick={bond1ETH}>
            Deposit
          </button>
        )}
        {/* {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )} */}
      </>
    </div>
  );
};

export default SendBond;
