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
}

function LiquidSoloSwitch({ isLiquid }: Props) {
  // Render
  return (
    <div className={styles.liquidSoloSwitch}>
      <button
        className={`${isLiquid ? styles.active : ""} ${styles.itemSwitch}`}
      >
        Liquid restaking
      </button>
      <button
        className={`${!isLiquid ? styles.active : ""} ${styles.itemSwitch}`}
      >
        Solo restake
      </button>
    </div>
  );
}

export default LiquidSoloSwitch;
