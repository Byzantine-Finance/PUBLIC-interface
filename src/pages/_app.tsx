// src/pages/_app.tsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet, sepolia } from "viem/chains";

import "../styles/globals.css";

import Layout from "../components/layout";
import Header from "@/components/Header/Header";
import { AppProps } from "next/app";
import Head from "next/head";

const config = createConfig({
  chains: [mainnet, sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const DynamicPool = dynamic(() => import("../components/layout.js"), {
  ssr: false,
});

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Project</title>
        <meta name="description" content="That's a good project!" key="desc" />
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
    </>
  );
}
