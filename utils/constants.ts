import { utils } from "ethers";

const MINTSTATUS_ENABLED = 0;
const MINTSTATUS_DISABLED = 1;
const MINTSTATUS_WHITELIST = 2;

export const disabledConfig = {
  tozziDuckPrice: utils.parseEther("0.1"),
  customDuckPrice: utils.parseEther("0.2"),
  maxCustomDucks: 200,
  tozziDuckMintStatus: MINTSTATUS_DISABLED,
  customDuckMintStatus: MINTSTATUS_DISABLED,
};

export const enabledConfig = {
  ...disabledConfig,
  tozziDuckMintStatus: MINTSTATUS_ENABLED,
  customDuckMintStatus: MINTSTATUS_ENABLED,
};

export const whitelistConfig = {
  ...disabledConfig,
  tozziDuckMintStatus: MINTSTATUS_WHITELIST,
  customDuckMintStatus: MINTSTATUS_WHITELIST,
};
