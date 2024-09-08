import { useReadContract } from "wagmi";
import { aavePoolAbi, aaveDepositContract, scrollConfig, initialAccountData } from "../utils";
import { AccountData } from "../types";

const useAccountData = (address: string | undefined) => {
  const { data: accountData } = useReadContract({
    address: aaveDepositContract as `0x${string}` | undefined,
    abi: aavePoolAbi,
    functionName: "getUserAccountData",
    args: address ? [address] : undefined,
    chainId: scrollConfig?.chainId,
  });

  const accountDataArray = accountData as AccountData;
  return accountData
    ? {
        totalCollateralBase: accountDataArray[0],
        totalDebtBase: accountDataArray[1],
        availableBorrowsBase: accountDataArray[2],
        currentLiquidationThreshold: accountDataArray[3],
        ltv: accountDataArray[4],
        healthFactor: accountDataArray[5],
      }
    : initialAccountData;
};

export default useAccountData;
