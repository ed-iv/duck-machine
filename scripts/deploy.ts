import { ethers } from "hardhat";
import { exit } from "process";
import { TheAmazingTozziDuckMachine__factory } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const TheAmazingTozziDuckMachine = await ethers.getContractFactory(
    "TheAmazingTozziDuckMachine"
  );
  const theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(
    "Test"
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
