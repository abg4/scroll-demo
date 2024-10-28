import { createAcrossClient } from "@across-protocol/app-sdk";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  scroll,
  base,
} from "viem/chains";
import { integratorId } from "../utils/constants";
import { createWalletClient, custom, type Chain } from "viem";

declare global {
  interface Window {
    ethereum?: any; // or a more specific type if known
  }
}

const useAcrossClient = (
  address: `0x${string}` | undefined,
  chain: Chain | null
): { acrossClient?: any; viemClient?: any } => {
  if (!address || !window?.ethereum || !chain)
    return { acrossClient: undefined, viemClient: undefined };

  const viemClient = createWalletClient({
    account: address,
    chain: chain,
    transport: custom(window.ethereum!),
  });

  const acrossClient = createAcrossClient({
    integratorId, // 2-byte hex string
    chains: [mainnet, optimism, arbitrum, scroll, polygon, base],
    walletClient: viemClient,
  });
  return { acrossClient, viemClient };
};

export default useAcrossClient;
