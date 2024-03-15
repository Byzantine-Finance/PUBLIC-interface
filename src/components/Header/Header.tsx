// src/components/Header.tsx
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import styles from "./Header.module.scss";

import FavIcon from "../../app/favicon.ico";

const Header: React.FC = () => {
  const router = useRouter();

  // Render
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href={"/"}>
        <Image src={FavIcon} height={40} alt="Logo of the project" />
      </Link>
      <div className={styles.menu}>
        <Link className={styles.itemMenu} href={"/menu-1"}>
          Menu 1
        </Link>
        <Link className={styles.itemMenu} href={"/menu-2"}>
          Menu 2
        </Link>
        <Link className={styles.itemMenu} href={"/menu-3"}>
          Menu 3
        </Link>
        <a
          className={styles.itemMenu}
          href="https://twitter.com/"
          target="_blank"
        >
          Docs
        </a>
      </div>
      <div className={styles.connect}>Connect</div>
    </header>
  );
};

export default Header;
