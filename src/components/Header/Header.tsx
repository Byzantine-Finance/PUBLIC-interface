// src/components/Header.tsx
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

import styles from "./Header.module.scss";

import ByzantineLogo from "@/assets/byzantineLogo.png";
import SparklesIcon from "@/assets/sparkles.svg";

const Header: React.FC = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  // Render
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href={"/"}>
        <Image
          src={ByzantineLogo}
          height={40}
          className={styles.logoClariFi}
          alt="Logo of ClariFi"
        />
      </Link>
      <div className={styles.menu}>
        <Link
          className={`${styles.itemMenu} ${
            isActive("/restake") ? styles.current : ""
          }`}
          href={"/restake"}
        >
          Restake
          <Image
            src={SparklesIcon}
            className={styles.logoClariFi}
            alt="Logo of ClariFi"
          />
        </Link>
        <Link
          className={`${styles.itemMenu} ${
            isActive("/validator") ? styles.current : ""
          }`}
          href={"/validator"}
        >
          Validator
        </Link>
        <Link
          className={`${styles.itemMenu} ${
            isActive("/dashboard") ? styles.current : ""
          }`}
          href={"/dashboard"}
        >
          Dahsbord
        </Link>
        <a
          className={styles.itemMenu}
          href="https://docs.byzantine.fi/"
          target="_blank"
        >
          Docs
        </a>
      </div>
      <div className={styles.connect}>
        <DynamicWidget />
      </div>
    </header>
  );
};

export default Header;
