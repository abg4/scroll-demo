import { useReadContract } from "wagmi";
import { BigNumber } from "ethers";
import { erc20Abi } from "../utils";
import { Network } from "../types";

const useBalance = (
  address: string | undefined,
  selectedNetwork: Network | null
) => {
  const {
    data: balance,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
  } = useReadContract({
    address: selectedNetwork?.usdcAddress as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: selectedNetwork?.id,
  });

  return {
    balance: balance ? BigNumber.from(balance) : undefined,
    isBalanceError,
    isBalanceLoading,
  };
};

export default useBalance;
