// src/pages/_app.tsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
// import { EthersExtension } from "@dynamic-labs/ethers-v5";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet, sepolia, goerli } from "viem/chains";

import "../styles/globals.css";

import Layout from "../components/layout";
import Header from "@/components/Header/Header";
import { AppProps } from "next/app";
import Head from "next/head";

const config = createConfig({
  chains: [mainnet, sepolia, goerli],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http("https://gateway.tenderly.co/public/sepolia"),
    [goerli.id]: http(),
  },
});

const DynamicPool = dynamic(() => import("../components/layout.js"), {
  ssr: false,
});

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DynamicContextProvider
        theme={"dark"}
        settings={{
          environmentId: "26c80771-ae3b-48b8-a4bb-2279429ee83d", //Jonas
          // environmentId: "4846a3fe-9dce-4455-827e-45b33be09f63", //Benoit
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <DynamicPool>
                <Head>
                  <title>Byzantine</title>
                  <meta
                    name="description"
                    content="That's a good project!"
                    key="desc"
                  />
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, user-scalable=no"
                  />
                  {/* <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:site" content="@clarifi_it" />
                  <meta
                    name="twitter:title"
                    content="ClariFi, gain clarity in tracking DeFi wallets"
                  />
                  <meta
                    name="twitter:image"
                    content="https://qboizbrjtkumfrvstono.supabase.co/storage/v1/object/public/assets/preview_website.png"
                  /> */}
                </Head>
                <Header />
                <Component {...pageProps} />
              </DynamicPool>
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </>
  );
}
