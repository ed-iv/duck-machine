import { utils } from "ethers";

export const MINTSTATUS_ENABLED = 0;
export const MINTSTATUS_DISABLED = 1;
export const MINTSTATUS_WHITELIST = 2;

export const ONE_WEEK = 604800;

export const defaultConfig = {
  tozziDuckPrice: utils.parseEther("0.1"),
  customDuckPrice: utils.parseEther("0.2"),
  maxCustomDucks: 200,
  tozziDuckMintStatus: MINTSTATUS_DISABLED,
  customDuckMintStatus: MINTSTATUS_DISABLED,
};

export const enabledConfig = {
  ...defaultConfig,
  tozziDuckMintStatus: MINTSTATUS_ENABLED,
  customDuckMintStatus: MINTSTATUS_ENABLED,
};

export const allowConfig = {
  ...defaultConfig,
  tozziDuckMintStatus: MINTSTATUS_WHITELIST,
  customDuckMintStatus: MINTSTATUS_WHITELIST,
};