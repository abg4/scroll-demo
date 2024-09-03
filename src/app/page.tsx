"use client";

import styles from "./page.module.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

import { wagmiConfig } from "../../configs/wagmiConfig";
import { privyConfig } from "../../configs/privyConfig";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <main className={styles.main}>
            <p>Across + Scroll demo</p>
          </main>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
