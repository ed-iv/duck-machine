import { ethers } from "hardhat";
import { exit } from "process";
import { BigNumber, utils } from "ethers";

const MINTSTATUS_ENABLED = BigNumber.from(0);
const MINTSTATUS_DISABLED = BigNumber.from(1);
const MINTSTATUS_WHITELIST = BigNumber.from(2);

const defaultConfig = {
  tozziDuckPrice: utils.parseEther("0.001"), 
  customDuckPrice: utils.parseEther("0.001"),
  maxCustomDucks: BigNumber.from(10),
  tozziDuckMintStatus: MINTSTATUS_ENABLED,
  customDuckMintStatus: MINTSTATUS_ENABLED,
};

async function main() {  
  const TheAmazingTozziDuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
  const theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(defaultConfig,"foo");
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
