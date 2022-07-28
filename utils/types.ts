import { BigNumber } from "ethers";

export interface MachineConfig {
  tozziDuckPrice: BigNumber;
  customDuckPrice: BigNumber;
  maxCustomDucks: number;
  tozziDuckMintStatus: number;
  customDuckMintStatus: number;
}