"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useBalance, useChainId, useEnsName } from "wagmi";

import LiquidSoloSwitch from "@/components/LiquidSoloSwitch/LiquidSoloSwitch";
import LiquidRestake from "@/components/LiquidRestake/LiquidRestake";
import SoloRestake from "@/components/SoloRestake/SoloRestake";

import styles from "./index.module.scss";

const listOp = [
  "0xdBE04587196De40ADF4f6ec60F62C4065014628f",
  "0x31c0388c89E40ee29dE428F529da60507043fFE3",
  "0xae2d60e4661DB4ee71467F7c055cf4cE0ee216Ee",
  "0x1C9794119f76171c2be8765c24afe63A9b71b9f4",
];

const CURRENT_VALIDATOR = 4;
const VALIDATOR_NEEDED = 4;

export default function Obol() {
  const { isConnected, address } = useAccount();
  function createCluster() {
    console.log("todo create cluster");
  }
  function activateCluster() {
    console.log("todo create cluster");
  }

  function jauge(level: number, max: number) {
    return (
      <div className={styles.jauge}>
        <div
          className={styles.level}
          style={{ width: (level / max) * 100 + "%" }}
        ></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftObol}>
        <div className={styles.titleLeftObol}>
          Operators willing to join a DV cluster
        </div>
        <div className={styles.listOperators}>
          <div className={styles.lineOperator}>
            <div>N</div>
            <div>address</div>
          </div>
          {listOp.map((e, index) => (
            <div key={index} className={styles.lineOperator}>
              <div>{index}</div>
              <div>
                {e.slice(0, 10) + "..." + e.slice(e.length - 8, e.length)}
              </div>
            </div>
          ))}
          <div className={styles.lineOperator}>
            <div>{listOp.length}</div>
            <div>
              {address &&
                address.slice(0, 10) +
                  "..." +
                  address.slice(address.length - 8, address.length)}
            </div>
            <div> - you</div>
          </div>
        </div>
      </div>
      <div className={styles.rightObol}>
        <div className={styles.containerRightObol}>
          <button className={styles.btnCreateCluster} onClick={createCluster}>
            Create a cluster
          </button>
          {jauge(CURRENT_VALIDATOR, VALIDATOR_NEEDED)}
          <button
            className={styles.btnActivateCluster}
            onClick={activateCluster}
            disabled={CURRENT_VALIDATOR % VALIDATOR_NEEDED == 0 ? false : true}
            style={{ opacity: CURRENT_VALIDATOR / VALIDATOR_NEEDED }}
          >
            Activate Distributed Validator
          </button>
        </div>
      </div>
    </div>
  );
}
