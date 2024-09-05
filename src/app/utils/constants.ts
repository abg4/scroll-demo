import { Network } from "../types";

export const aaveConfig = {
  depositContract: "0x11fCfe756c05AD438e312a7fd934381537D3cFfe",
};

export const networks: Network[] = [
  {
    chainId: 1,
    name: "Ethereum",
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    spokePoolAddress: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5",
    imgUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    explorerUrl: "https://etherscan.io",
  },
  {
    chainId: 137,
    name: "Polygon",
    usdcAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    spokePoolAddress: "0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096",
    imgUrl: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    explorerUrl: "https://polygonscan.com", 
  },
  {
    chainId: 42161,
    name: "Arbitrum",
    usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    spokePoolAddress: "0xe35e9842fceaca96570b734083f4a58e8f7c5f2a",
    imgUrl: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
    explorerUrl: "https://arbiscan.io",
  },
];

export const scrollConfig: Network = {
  chainId: 534352,
  name: "Scroll",
  usdcAddress: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
  spokePoolAddress: "0x3bad7ad0728f9917d1bf08af5782dcbd516cdd96",
  imgUrl: "https://cryptologos.cc/logos/scroll-logo.svg",
  multicallHandler: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
  explorerUrl: "https://scrollscan.com",
};

export const initialAccountData = {
  totalCollateralBase: BigInt(0),
  totalDebtBase: BigInt(0),
  availableBorrowsBase: BigInt(0),
  currentLiquidationThreshold: BigInt(0),
  ltv: BigInt(0),
  healthFactor: BigInt(0),
};