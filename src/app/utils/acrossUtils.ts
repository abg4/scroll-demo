import { type Address, encodeFunctionData, parseAbiItem } from "viem";
import { aaveDepositContract } from "./constants";

export function generateMessageForMulticallHandler(
  depositAmount: bigint,
  outputToken: string,
  userAddress: string
): any {
  return {
    // This address will receive the amount of bridged tokens on the destination chain if
    // one of the cross-chain actions fail. Leftover tokens are here as well if all actions
    // succeed.
    fallbackRecipient: userAddress,
    // List of actions that should be executed on the destination chain
    actions: [
      {
        // Address of target contract on destination chain, i.e. USDC on Optimism
        target: outputToken,
        // Encoded function data, i.e. calldata for approving USDC to be pulled in by
        // staking contract
        callData: generateApproveCallData(aaveDepositContract, depositAmount),
        // Native msg.value, can be 0 in the context of USDC
        value: 0,
        // Update call data callback - we need to provide a callback function to
        // re-generate calldata because it depends on the `outputAmount`, i.e.
        // `inputAmount` - `relayer fee`. This is the amount the user has available after a
        // relayer filled the deposit on the destination chain.
        updateCallData: (outputAmount: bigint) =>
          generateApproveCallData(aaveDepositContract, outputAmount),
      },
      {
        // Address of target contract on destination chain, i.e. staking contract
        // on Optimism
        target: aaveDepositContract,
        // Encoded function data, i.e. calldata for staking USDC on behalf of user
        callData: generateDepositCallData(
          outputToken as `0x${string}`,
          userAddress as `0x${string}`,
          depositAmount
        ),
        // Native msg.value, can be 0 in the context of USDC
        value: 0,
        // Same reasoning as above in the approve step.
        updateCallData: (outputAmount: bigint) =>
          generateDepositCallData(
            outputToken as `0x${string}`,
            userAddress as `0x${string}`,
            outputAmount
          ),
      },
    ],
  };
}

export function generateApproveCallData(spender: Address, amount: bigint) {
  const approveCallData = encodeFunctionData({
    abi: [parseAbiItem("function approve(address spender, uint256 value)")],
    args: [spender, amount],
  });

  return approveCallData;
}

export function generateDepositCallData(
  outputToken: Address,
  userAddress: Address,
  amount: bigint
) {
  const aaveReferralCode = 0;

  return encodeFunctionData({
    abi: [
      parseAbiItem(
        "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)"
      ),
    ],
    args: [outputToken, amount, userAddress, aaveReferralCode],
  });
}
