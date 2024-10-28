import { type Chain } from "viem";

export interface Network extends Chain {
  usdcAddress: string;
  spokePoolAddress: string;
  imgUrl: string;
  multicallHandler?: string;
}

export type AccountData = [bigint, bigint, bigint, bigint, bigint, bigint];
