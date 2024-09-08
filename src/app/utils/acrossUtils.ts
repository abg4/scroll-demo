import { QuoteParams, QuoteResponse } from "../types";
import { ethers } from "ethers";
import { aaveDepositContract } from "./constants";

export const getQuote = async ({
  inputToken,
  outputToken,
  originChainId,
  destinationChainId,
  amount,
  recipient,
  message,
}: QuoteParams): Promise<QuoteResponse | undefined> => {
  try {
    let response = await fetch(
      `https://app.across.to/api/suggested-fees?token=${inputToken}&outputToken=${outputToken}&originChainId=${originChainId}&destinationChainId=${destinationChainId}&amount=${amount}&recipient=${recipient}&message=${message}`
    );
    console.log(
      "quote url",
      `https://app.across.to/api/suggested-fees?token=${inputToken}&outputToken=${outputToken}&originChainId=${originChainId}&destinationChainId=${destinationChainId}&amount=${amount}&recipient=${recipient}&message=${message}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: QuoteResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

export function generateMessageForMulticallHandler(
  depositAmount: string,
  outputToken: string,
  userAddress: string
): string {
  const abiCoder = new ethers.utils.AbiCoder();
  const aaveReferralCode = 0;
  const erc20Interface = new ethers.utils.Interface([
    "function approve(address spender, uint256 value)",
  ]);
  const depositInterface = new ethers.utils.Interface([
    "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  ]);

  const approveCalldata = erc20Interface.encodeFunctionData("approve", [
    aaveDepositContract,
    depositAmount,
  ]);
  const depositCalldata = depositInterface.encodeFunctionData("supply", [
    outputToken,
    depositAmount,
    userAddress,
    aaveReferralCode,
  ]);

  return abiCoder.encode(
    [
      "tuple(" +
        "tuple(" +
        "address target," +
        "bytes callData," +
        "uint256 value" +
        ")[]," +
        "address fallbackRecipient" +
        ")",
    ],
    [
      [
        [
          [outputToken, approveCalldata, 0],
          [aaveDepositContract, depositCalldata, 0],
        ],
        userAddress,
      ],
    ]
  );
}
