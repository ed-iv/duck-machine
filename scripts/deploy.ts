/* eslint-disable camelcase */
/* eslint-disable node/no-missing-import */
import { ethers } from "hardhat";
import { exit } from "process";
import { BigNumber, utils } from "ethers";
import { TheAmazingTozziDuckMachine__factory } from "../typechain";

const MINTSTATUS_ENABLED = BigNumber.from(0);
const MINTSTATUS_DISABLED = BigNumber.from(1);
const MINTSTATUS_WHITELIST = BigNumber.from(2);

const defaultConfig = {
  tozziDuckPrice: utils.parseEther("0.1"), // tozziDuckPrice
  customDuckPrice: utils.parseEther("0.2"), // customDuckPrice
  maxCustomDucks: BigNumber.from(0), // maxCustomDucks
  tozziDuckMintStatus: MINTSTATUS_ENABLED, // tozziDuckMintStatus
  customDuckMintStatus: MINTSTATUS_ENABLED, // tozziDuckMintStatus
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const TheAmazingTozziDuckMachine = await ethers.getContractFactory(
    "TheAmazingTozziDuckMachine"
  );
  const theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(
    defaultConfig,
    "Ownership Token URI"
  );
  await theAmazingTozziDuckMachine.deployed();
  console.log(
    "TheAmazingTozziDuckMachine deployed to:",
    theAmazingTozziDuckMachine.address
  );
}

main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);
    exit(1);
  });
