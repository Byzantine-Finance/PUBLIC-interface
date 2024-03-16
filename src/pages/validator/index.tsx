"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import SendBond from "@/components/SendBond/SendBond";
import BidSettings from "@/components/BidSettings/BidSettings";

import styles from "./index.module.scss";

export default function Restake() {
  const [isBonded, setIsBonded] = useState<boolean>(false);

  function clickBond() {
    setIsBonded(true);
  }

  return (
    <div className={styles.container}>
      {!isBonded ? (
        <div className={styles.explainer} onClick={clickBond}>
          <div className={styles.titleExplainer}>Bids</div>
          <div className={styles.descExplainer}>
            In order to join the protocol and run auctions, validators are
            required to deposit a 1ETH Bond.
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
          <div className={styles.titleExplainer}>Bids</div>
          <div className={styles.descExplainer}>
            Auctions are a part of the Byzantine Finance protocol to fairly and
            efficiently match stakers with operators in a framework that is
            beneficial for both of them.
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
      {!isBonded ? <SendBond /> : <BidSettings />}
    </div>
  );
}
