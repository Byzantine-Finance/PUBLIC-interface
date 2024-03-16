// src/components/LiquidSoloSwitch.tsx
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

import styles from "./LiquidSoloSwitch.module.scss";

import ByzantineLogo from "@/assets/byzantineLogo.png";
import SparklesIcon from "@/assets/sparkles.svg";

interface Props {
  isLiquid: boolean;
  setIsLiquid: (isLiquid: boolean) => void;
}

function LiquidSoloSwitch({ isLiquid, setIsLiquid }: Props) {
  const router = useRouter();

  const handleSwitch = (toLiquid: boolean) => {
    setIsLiquid(toLiquid); // Mise à jour de l'état dans le composant parent
    const hash = toLiquid ? "liquid" : "solo";
    // Mettre à jour l'URL sans recharger la page
    router.push(`${router.pathname}#${hash}`, undefined, { shallow: true });
  };

  // Update the URL hash without reloading the page
  const updateUrlHash = (hash: string) => {
    // Push the new hash to the router, maintaining the current pathname and query
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
        hash: hash,
      },
      undefined,
      { shallow: true }
    );
  };

  // Handle click for Liquid restaking
  const handleLiquidClick = () => {
    updateUrlHash("liquid");
  };

  // Handle click for Solo restake
  const handleSoloClick = () => {
    updateUrlHash("solo");
  };

  // Render
  return (
    <div className={styles.liquidSoloSwitch}>
      <button
        className={`${isLiquid ? styles.active : ""} ${styles.itemSwitch}`}
        onClick={() => handleSwitch(true)}
      >
        Liquid restaking
      </button>
      <button
        className={`${!isLiquid ? styles.active : ""} ${styles.itemSwitch}`}
        onClick={() => handleSwitch(false)}
      >
        Solo restake
      </button>
    </div>
  );
}

export default LiquidSoloSwitch;
