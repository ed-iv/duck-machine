import { TheAmazingTozziDuckMachine } from '../typechain';
import { enabledConfig } from './constants';
import duckData from '../duck-data/proofs.json';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export const mintTozziDuck = async (duckId: number, contract: TheAmazingTozziDuckMachine) => {
  await contract.mintTozziDuck(
    duckId, 
    // @ts-ignore
    duckData[duckId].webp, 
    // @ts-ignore
    duckData[duckId].proof, 
    { value: enabledConfig.tozziDuckPrice }
  );
};

export const mintCustomDuck = async (
  webp: string, 
  contract: TheAmazingTozziDuckMachine,
  who?: SignerWithAddress
) => {
  if (who) contract = contract.connect(who);
  await contract.mintCustomDuck(
    webp,
    { value: enabledConfig.customDuckPrice }
  );
};

export const parseMetadata = (dataURI: string) => {
  const json = Buffer.from(dataURI.substring(29), "base64").toString();
  const result = JSON.parse(json);
  return result;
}