import { http } from "wagmi";
import {
  mainnet,
  polygon,
  arbitrum,
  scroll,
  base,
  optimism,
} from "wagmi/chains";
import { createConfig } from "@privy-io/wagmi";

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, scroll, base, optimism],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [scroll.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
});
