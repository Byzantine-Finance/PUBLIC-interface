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
  return <div className={styles.container}>Obol</div>;
}
