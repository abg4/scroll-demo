"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { Header } from "./components/Header";
import "./globals.css";
import { wagmiConfig } from "./configs/wagmiConfig";
import { privyConfig } from "./configs/privyConfig";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={privyConfig}
          >
            <WagmiProvider config={wagmiConfig}>
              <Header />
              {children}
            </WagmiProvider>
          </PrivyProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
