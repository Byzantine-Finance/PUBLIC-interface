// import Navbar from "./navbar";
// import Footer from "./footer";
import Image from "next/image";
import { useBlockNumber } from "wagmi";

import imageBg from "@/assets/background.png";

export default function Layout({ children }) {
  const { data, isError, isLoading } = useBlockNumber();

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
      {/* <div class="imgBackground">
        <Image src={imageBg} alt="Logo of ClariFi" />
      </div> */}
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
