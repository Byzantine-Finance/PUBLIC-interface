// import Navbar from "./navbar";
// import Footer from "./footer";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useBlockNumber } from "wagmi";
import { useUser } from "@/contexts/ContextProvider";

import imageBg from "@/assets/background.png";

export default function Layout({ children }) {
  const { isConnected, address } = useAccount();

  const { data, isError, isLoading } = useBlockNumber({
    watch: true,
  });
  // const [isChecking, setIsChecking] = useState(true);
  const { triggerAnimation, setShowAnimation } = useUser();

  useEffect(() => {
    const handleClick = (event) => {
      // console.log(event.target.id);
      // console.log(event.target.className);
      if (
        !isConnected &&
        event.target.id !== "invincible" &&
        event.target.id !== "dynamic-widget" &&
        event.target.className != "dynamic-shadow-dom"
      ) {
        event.preventDefault();
        // shakeIt();
        triggerAnimation();
      }
    };
    // Attach the event listener to the whole document
    document.addEventListener("click", handleClick);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isConnected]);

  return (
    <main
      style={{
        width: "calc(100vw - 4px)",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        height: "100%",
      }}
    >
      {children}
      <div class="imgBackground">
        <Image src={imageBg} alt="Logo of ClariFi" />
      </div>
      {!isLoading && data && (
        <a
          class="numberBloc"
          href={"https://sepolia.etherscan.io/block/" + data.toString()}
          target="_blank"
        >
          <div>{data.toString()}</div>
          <div></div>
        </a>
      )}
    </main>
  );
}
