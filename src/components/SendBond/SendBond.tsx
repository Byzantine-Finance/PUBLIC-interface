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

import styles from "./SendBond.module.scss";

import ByzantineLogo from "@/assets/byzantineLogo.png";
import SparklesIcon from "@/assets/sparkles.svg";
import SwitchArrows from "@/assets/switchArrows.svg";
import Ethereum from "@/assets/ethereum.png";

const RATIO = 1; // 1 ETH = 0.9934 byzETH

const SendBond: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const chainId = useChainId();
  const [restaking, setRestaking] = useState<boolean>(true);

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

  function bond1ETH() {
    console.log("Bond 1 ETH"); //TODO
  }

  // Render
  return (
    <div className={styles.restakeApp}>
      <div className={styles.boxApp}>
        {/* <div className={styles.nameBox}>
          {restaking ? "Restake" : "Withdraw"}
        </div> */}
        <div className={styles.contentBox}>
          <div className={styles.leftBox}>1</div>
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
              Balance: {isConnected ? balanceETH?.formatted.slice(0, 8) : "..."}
            </div>
          </div>
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
        ) : isPending ? (
          <button disabled className={`${styles.connectBtn} ${styles.pending}`}>
            ...
          </button>
        ) : (
          <button className={styles.connectBtn} onClick={bond1ETH}>
            Bond 1 ETH
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

export default SendBond;
