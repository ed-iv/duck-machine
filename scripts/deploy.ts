import { ethers } from "hardhat";
import { exit } from "process";
import { BigNumber, utils } from "ethers";

const MINTSTATUS_ENABLED = BigNumber.from(0);
const MINTSTATUS_DISABLED = BigNumber.from(1);
const MINTSTATUS_WHITELIST = BigNumber.from(2);

const defaultConfig = {
  tozziDuckPrice: utils.parseEther("1"), 
  customDuckPrice: utils.parseEther("1"),
  maxCustomDucks: BigNumber.from(16),
  tozziDuckMintStatus: MINTSTATUS_DISABLED,
  customDuckMintStatus: MINTSTATUS_DISABLED,
};

async function main() {  
  const TheAmazingTozziDuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
  const theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(defaultConfig, "https://ipfs.io/ipfs/QmS2ypEqkaddZVTix8mRe3f14DJktYfAQ7ibkgnhcFk967");
  await theAmazingTozziDuckMachine.deployed();
  console.log("🦆 Duck Machine Deployed To:", theAmazingTozziDuckMachine.address);
  console.log("Initial Config: ", defaultConfig);
}

main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);
    exit(1);
  });
