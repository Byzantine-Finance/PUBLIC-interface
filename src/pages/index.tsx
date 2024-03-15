import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import styles from "./Index.module.scss";

export default function Home() {
  return (
    <div
      className={styles.App}
      style={{ height: "100%", display: "flex", alignItems: "center" }}
    >
      <h1>Restaking, as you like it.</h1>
      <h2>Build on the most flexible native EigenLayer protocol.</h2>
    </div>
  );
}
