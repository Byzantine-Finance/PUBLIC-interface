"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import SendBond from "@/components/SendBond/SendBond";
import BidSettings from "@/components/BidSettings/BidSettings";

import styles from "./index.module.scss";

import { auctionAddress, auctionABI } from "@/ABI/auctionSystem";
import { useAccount, useReadContract } from "wagmi";

export default function Restake() {
  const [isBonded, setIsBonded] = useState<"loading" | "bond" | "bid">("bond");
  const { isConnected, address } = useAccount();

  const { data, isFetching, isPending } = useReadContract({
    address: auctionAddress,
    abi: auctionABI,
    functionName: "getStatus",
    args: [address],
  });
  useEffect(() => {
    console.log("data");
    console.log(data);
    if (data === undefined) {
      setIsBonded("bond");
    } else {
      if (data == 0) {
        setIsBonded("bond");
      } else {
        setIsBonded("bid");
      }
    }
  }, [data]);

  function clickBond() {
    if (isBonded == "bid") {
      setIsBonded("bond");
    } else {
      setIsBonded("bid");
    }
  }

  return (
    <div className={styles.container}>
      {data === undefined || data === 0 ? (
        <div className={styles.explainer} onClick={clickBond}>
          <div className={styles.titleExplainer}>Operator bond</div>
          <div className={styles.descExplainer}>
            A bond to make sure everything goes well. You'll get this back if
            you ever decided to exit the protocol.{" "}
          </div>
          <div>
            In the meantime, we stake it for you and you get the returns.
          </div>
          <a
            href="https://docs.byzantine.fi/protocol/becoming-a-node-operator/joining-the-protocol#id-1.-joining-the-auction-set"
            target="_bank"
            className={styles.leanrMoreExplainer}
          >
            Learn more.
          </a>
        </div>
      ) : (
        <div className={styles.explainer} onClick={clickBond}>
          <div className={styles.titleExplainer}>Make a bid</div>
          <div className={styles.descExplainer}>
            Choose your desired duration of operation and profit margin you want
            to achieve. Using the expected validator return, this generates an
            validator bid to be paid upfront.
          </div>
          <div>
            Your bid is held by our auction contract until you are selected to
            become a validator.{" "}
            <b>As you validate, you get to keep 100% of your rewards.</b>
          </div>
          <a
            href="https://docs.byzantine.fi/protocol/node-operator-auction/auction-mechanism"
            target="_bank"
            className={styles.leanrMoreExplainer}
          >
            Learn more about auctions.
          </a>
        </div>
      )}
      {data === undefined || data === 0 ? <SendBond /> : <BidSettings />}
    </div>
  );
}
