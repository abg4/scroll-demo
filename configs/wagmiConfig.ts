import { http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import {createConfig} from '@privy-io/wagmi';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})