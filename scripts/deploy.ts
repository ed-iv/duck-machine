import { ethers } from "hardhat";
import { exit } from "process";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ChainsawProjects = await ethers.getContractFactory("ChainsawProjects");
  const chainsawProjects = await ChainsawProjects.deploy();
  await chainsawProjects.deployed();

  const TheAmazingTozziDuckMachine = await ethers.getContractFactory(
    "TheAmazingTozziDuckMachine"
  );
  const theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(
    chainsawProjects.address
  );
  await theAmazingTozziDuckMachine.deployed();

  console.log("ChainsawProjects deployed to:", chainsawProjects.address);
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
