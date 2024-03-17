// src/components/BidSettings.tsx
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";
import { toast } from "react-toastify";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Tooltip } from "@nextui-org/react";
import Decimal from "decimal.js";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { auctionABI, auctionAddress } from "@/ABI/auctionSystem";

import { ethers } from "ethers";
import { formatEther, parseEther, parseUnits } from "viem";

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
import { ETH_PRICE, useUser } from "@/contexts/ContextProvider";

const AVG_RET_BEACON = 0.037; // 1 ETH = 0.9934 byzETH
const PERCENTAGE_SCALING_FACTOR = 10 ^ 18;

const BidSettings: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const { showAnimation } = useUser();

  const [inputValue, setInputValue] = useState<string>("0");

  const [vestingPeriod, setVestingPeriod] = useState(30);
  const [discountRate, setDiscountRate] = useState(0);
  const [bidAmount, setBidAmount] = useState("");

  const { data: maxDiscountRate } = useReadContract({
    address: auctionAddress,
    abi: auctionABI,
    functionName: "maxDiscountRate",
  });

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
  // console.log(contractBalance ? ethers.formatEther(contractBalance) : "");
  //   const { addressW, setAddressW } = useState();

  // useEffect(() => {
  //   console.log("discountRate");
  //   console.log(discountRate);
  // }, [discountRate]);
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

  async function setBid() {
    console.log("Attempting to set a bid with duration and discount rate...");
    try {
      console.log("Sending the tx: ");
      const scaledDiscountRate = parseUnits(discountRate.toString(), 18);
      console.log(vestingPeriod);
      console.log(scaledDiscountRate);
      console.log("-----");
      console.log(bidAmountPrice);
      console.log(parseEther(bidAmountPrice.toString()));
      const tx = await writeContract({
        address: auctionAddress,
        abi: auctionABI,
        functionName: "setBid",
        args: [vestingPeriod, scaledDiscountRate],
        value: parseEther(bidAmountPrice.toString()),
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  }

  // Fonction pour convertir une valeur linéaire du curseur en une valeur logarithmique
  const toLogarithmic = (value: number, min: number, max: number) => {
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    const scale = (maxLog - minLog) / (max - min);

    return Math.exp(minLog + scale * (value - min));
  };

  // Fonction pour convertir une valeur logarithmique en une valeur linéaire du curseur
  const toLinear = (value: number, min: number, max: number) => {
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    const scale = (maxLog - minLog) / (max - min);

    return (Math.log(value) - minLog) / scale + min;
  };

  // Utilisez ces fonctions pour définir et lire la valeur du curseur
  const handleChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linearValue = Number(e.target.value);
    const logarithmicValue = toLogarithmic(linearValue, 30, 3650);

    setVestingPeriod(Math.round(logarithmicValue));
  };

  const handleDisplaySliderValue = () => {
    return toLinear(vestingPeriod, 30, 3650);
  };

  // const discountRateN = new Decimal(discountRate);
  // const AVG_RET_BEACON = new Decimal(0.037);
  // const vestingPeriod = new Decimal(99);
  // const days = new Decimal(365);

  const bidAmountPrice = Decimal.sub(1, new Decimal(discountRate).div(100))
    .mul(new Decimal(AVG_RET_BEACON))
    .mul(32)
    .mul(new Decimal(vestingPeriod))
    .div(new Decimal(365));
  // const bidAmountPrice2 =
  //   ((1 - discountRate / 100) * AVG_RET_BEACON * 32 * vestingPeriod) / 365;

  // Render
  return (
    <div className={styles.restakeApp}>
      <div className={styles.boxApp}>
        <div className={styles.contentBox}>
          <div className={styles.firstBox}>
            <div className={styles.firstLeftBox}>
              <div>Validating period</div>
              <Tooltip
                content={
                  <div className="tooltip">
                    The number of days for which you want to operate your node
                  </div>
                }
              >
                <div className={styles.info}>i</div>
              </Tooltip>
            </div>
            <div className={styles.firstRightBox}>
              <input
                type="number"
                value={vestingPeriod}
                onChange={(e) =>
                  handleInputChange(e.target.value, setVestingPeriod, 0, 100000)
                }
                className={styles.input}
              />
              <div>days</div>
            </div>
          </div>
          <div className={styles.secondBox}>
            <input
              type="range"
              min="30"
              max="3650"
              value={handleDisplaySliderValue()}
              onChange={handleChangeSlider}
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
              <Tooltip
                content={
                  <div className="tooltip">
                    Your desired profit margin. It determines your predicted
                    ranking in the auction set.
                  </div>
                }
              >
                <div className={styles.info}>i</div>
              </Tooltip>
            </div>
            <div className={styles.firstRightBox}>
              <input
                type="number"
                value={discountRate}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setDiscountRate,
                    0,
                    maxDiscountRate
                      ? Number(formatEther(maxDiscountRate as bigint))
                      : 15
                  )
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
      <div className={`${styles.boxApp} ${styles.estimatedRev}`}>
        <div className={styles.contentBox}>
          <div className={styles.firstBox}>
            <div className={styles.firstLeftBox}>
              <div>Estimated annual</div>
              <div>
                validator return
                <Tooltip
                  content={
                    <div className="tooltip">
                      A full validator's annualised returns, based on our
                      protocol's average across the last 30 days. Includes MEV
                      and tips.
                    </div>
                  }
                >
                  <div className={styles.info}>i</div>
                </Tooltip>
              </div>
            </div>
            <div className={styles.firstRightBox}>
              <div>{32 * AVG_RET_BEACON} ETH</div>
              <div>~{(AVG_RET_BEACON * 100).toFixed(1)}% APR</div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.boxApp} ${styles.bidAmount}`}>
        <div className={styles.contentBox}>
          <div>
            <div>{bidAmountPrice.toFixed(5)}</div>
            <div>ETH</div>
          </div>
          <div className={styles.titleBox}>Bid amount</div>
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
        ) : bidAmountPrice ? (
          <button className={styles.connectBtn} onClick={setBid}>
            Bid
          </button>
        ) : (
          <button className={`${styles.connectBtn} ${styles.insert}`}>
            Change settings
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

export default BidSettings;
