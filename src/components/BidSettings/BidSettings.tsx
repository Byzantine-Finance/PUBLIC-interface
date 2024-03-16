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
import { Tooltip } from "@nextui-org/react";

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
import { ETH_PRICE } from "@/contexts/ContextProvider";

const AVG_RET_BEACON = 0.0356; // 1 ETH = 0.9934 byzETH

const BidSettings: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const chainId = useChainId();
  const [inputValue, setInputValue] = useState<string>("0");

  const [vestingPeriod, setVestingPeriod] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [bidAmount, setBidAmount] = useState("");

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number>>,
    min: number,
    max: number
  ) => {
    const numericValue = Math.max(min, Math.min(max, Number(value)));
    setter(numericValue);
  };

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
  const bidAmountPrice = (vestingPeriod * discountRate * AVG_RET_BEACON) / 365;

  // Render
  return (
    <div className={styles.restakeApp}>
      <div className={styles.boxApp}>
        <div className={styles.contentBox}>
          <div className={styles.firstBox}>
            <div className={styles.firstLeftBox}>
              <div>Vesting period</div>
              <Tooltip content={<div className="tooltip">Blablablablabla</div>}>
                <div className={styles.info}>i</div>
              </Tooltip>
            </div>
            <div className={styles.firstRightBox}>
              <input
                type="number"
                value={vestingPeriod}
                onChange={(e) =>
                  handleInputChange(e.target.value, setVestingPeriod, 0, 365)
                }
                className={styles.input}
              />
              <div>days</div>
            </div>
          </div>
          <div className={styles.secondBox}>
            <input
              type="range"
              min="0"
              max="365"
              value={vestingPeriod}
              onChange={(e) => setVestingPeriod(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>
      <div className={styles.boxApp}>
        <div className={styles.contentBox}>
          <div className={styles.firstBox}>
            <div className={styles.firstLeftBox}>
              <div>Discount rate</div>
              <Tooltip content={<div className="tooltip">Blablablablabla</div>}>
                <div className={styles.info}>i</div>
              </Tooltip>
            </div>
            <div className={styles.firstRightBox}>
              <input
                type="number"
                value={discountRate}
                onChange={(e) =>
                  handleInputChange(e.target.value, setDiscountRate, 0, 15)
                }
                className={styles.input}
              />
              <div>%</div>
            </div>
          </div>
          <div className={styles.secondBox}>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={discountRate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>
      <div className={styles.boxApp}>
        <div className={styles.contentBox}>
          <div className={styles.firstBox}>
            <div className={styles.firstLeftBox}>
              <div>Bid amount</div>
              <Tooltip content={<div className="tooltip">Blablablablabla</div>}>
                <div className={styles.info}>i</div>
              </Tooltip>
            </div>
            <div className={styles.bidAmountEth}>
              <div>
                <div>{bidAmountPrice.toFixed(5)}</div>
                <div>ETH</div>
              </div>
              <div className={styles.priceEth}>
                {inputValue && "$" + (bidAmountPrice * ETH_PRICE).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.descApp}>
        <div className={styles.lineDesc}>
          av. return of the beacon chain: {(AVG_RET_BEACON * 100).toFixed(2)}%
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
        ) : bidAmountPrice ? (
          <button className={styles.connectBtn} onClick={withdrawETH}>
            Bid
          </button>
        ) : (
          <button className={`${styles.connectBtn} ${styles.insert}`}>
            Change settings
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
