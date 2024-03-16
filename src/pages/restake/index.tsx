"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import LiquidSoloSwitch from "@/components/LiquidSoloSwitch/LiquidSoloSwitch";
import LiquidRestake from "@/components/LiquidRestake/LiquidRestake";
import SoloRestake from "@/components/SoloRestake/SoloRestake";

import styles from "./index.module.scss";

export default function Restake() {
  const router = useRouter();

  const [isLiquid, setIsLiquid] = useState(true);

  useEffect(() => {
    // Mettre à jour l'état en fonction du hash de l'URL au montage
    const hash = router.asPath.split("#")[1];
    setIsLiquid(hash !== "solo");

    // Écouter les changements de hash pour mettre à jour l'état
    const handleHashChange = (e: { newURL: string }) => {
      const newHash = e.newURL.split("#")[1];
      setIsLiquid(newHash !== "solo");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return (
    <div className={styles.container}>
      <LiquidSoloSwitch isLiquid={isLiquid} setIsLiquid={setIsLiquid} />
      {isLiquid ? <LiquidRestake /> : <SoloRestake />}
    </div>
  );
}
