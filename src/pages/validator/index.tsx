"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import SendBond from "@/components/SendBond/SendBond";

import styles from "./index.module.scss";

export default function Restake() {
  return (
    <div className={styles.container}>
      <div className={styles.explainer}>
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
      <SendBond />
    </div>
  );
}
