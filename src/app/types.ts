export interface Network {
  chainId: number;
  name: string;
  usdcAddress: string;
  spokePoolAddress: string;
  imgUrl: string;
  explorerUrl: string;
  multicallHandler?: string;
}

export interface QuoteParams {
  inputToken: string;
  outputToken: string;
  originChainId: number;
  destinationChainId: number;
  amount: string;
  recipient: string | undefined;
  message: string;
}

export interface QuoteResponse {
  totalRelayFee: {
    total: string;
  };
  timestamp: number;
  exclusivityDeadline: number;
  exclusiveRelayer: string;
  estimatedFillTimeSec: string;
}

export type AccountData = [bigint, bigint, bigint, bigint, bigint, bigint];
