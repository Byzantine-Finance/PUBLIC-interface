"use client";
import Link from "next/link";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useBalance, useChainId, useEnsName } from "wagmi";

import LiquidSoloSwitch from "@/components/LiquidSoloSwitch/LiquidSoloSwitch";
import LiquidRestake from "@/components/LiquidRestake/LiquidRestake";
import SoloRestake from "@/components/SoloRestake/SoloRestake";

import styles from "./index.module.scss";

const OPERATORS_NEEDED = 4;

//var operatorsList: string[] = [
//  "0xdBE04587196De40ADF4f6ec60F62C4065014628f",
//  "0x31c0388c89E40ee29dE428F529da60507043fFE3",
//  "0xae2d60e4661DB4ee71467F7c055cf4cE0ee216Ee",
//  "0x1C9794119f76171c2be8765c24afe63A9b71b9f4",
//];

export default function Obol() {

  const { isConnected, address } = useAccount();

  const [operatorsList, setOperatorsList] = useState<string[]>([]);

  // +1 because of the hard coded operator
  const CURRENT_OPERATORS = operatorsList.length + 1;

  function joinCluster(address: string) {
    if (!operatorsList.includes(address)) {
      setOperatorsList(prev => [...prev, address]);
    } else {
      alert("You are already on the waiting list");
    }
  }

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
      <button 
        className={ isConnected ? styles.joinClusterButtonEnable : styles.joinClusterButtonDisable}
        onClick={async () => {
          if (address) {
            joinCluster(address);
          } else {
            alert("Please connect your wallet");
          }

        }}
      >
        Join a Cluster
      </button>
      <table className={styles.tab}>
        <caption className={styles.caption}>Operators willing to join a DV cluster</caption>
        
        <tr className={styles.head}>
          <th className={styles.opCol}>Operators</th>
          <th className={styles.addressCol}>Addresses</th>
        </tr>
        
        <tbody>
          <tr key={0}>
            <td className={styles.opCell}>Op0</td>
            <td className={styles.addrCell}>0xdBE04587196De40ADF4f6ec60F62C4065014628f</td>
          </tr>

          {operatorsList.map((addr, index) => (
            <tr key={index + 1}>
              <td className={styles.opCell}>{`Op${index+1}`}</td>
              <td className={styles.addrCell}>{addr}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.sdkIntercation}>
          <div className={styles.containerRightObol}>
            <button className={styles.btnCreateCluster} onClick={createCluster}>
              Create a cluster
            </button>
            {jauge(CURRENT_OPERATORS, OPERATORS_NEEDED)}
            <button
              className={styles.btnActivateCluster}
              onClick={activateCluster}
              disabled={CURRENT_OPERATORS % OPERATORS_NEEDED == 0 ? false : true}
              style={{ opacity: CURRENT_OPERATORS / OPERATORS_NEEDED }}
            >
              Activate Distributed Validator
            </button>
          </div>
        </div>
    </div>
  );
}
