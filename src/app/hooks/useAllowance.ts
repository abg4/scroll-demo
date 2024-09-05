import { useReadContract } from "wagmi";
import { BigNumber } from "ethers";
import { erc20Abi } from "../utils";

const useAllowance = (
  address: string | undefined,
  selectedNetwork: any,
  rawAmount: string
) => {
  const { data: allowance } = useReadContract({
    address: selectedNetwork?.usdcAddress as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: "allowance",
    args:
      address && selectedNetwork?.spokePoolAddress
        ? [address, selectedNetwork.spokePoolAddress as `0x${string}`]
        : undefined,
    chainId: selectedNetwork?.chainId,
  });

  const allowanceValue = allowance
    ? BigNumber.from(allowance)
    : BigNumber.from(0);

  const needsApproval =
    !!rawAmount && allowanceValue.lt(BigNumber.from(rawAmount));

  return { allowance: allowanceValue, needsApproval };
};

export default useAllowance;
