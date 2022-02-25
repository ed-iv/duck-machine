const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainsawProjects", function () {
  it("addProject", async function () {
    // ChainsawProjects
    const ChainsawProjects = await ethers.getContractFactory(
      "ChainsawProjects"
    );
    const chainsawProjects = await ChainsawProjects.deploy();
    await chainsawProjects.deployed();

    // TheAmazingTozziDuckMachine
    const TheAmazingTozziDuckMachine = await ethers.getContractFactory(
      "TheAmazingTozziDuckMachine"
    );
    const theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(
      chainsawProjects.address
    );
    await theAmazingTozziDuckMachine.deployed();

    // const addProjectTx = await chainsawProjects.addProject(
    //   "Isekai",
    //   "0x70168077506be0A3dca87b5FeAc1e5D2Ce6406c3"
    // );
    // console.log(addProjectTx);

    // const addProjectTx = await theAmazingTozziDuckMachine.setTozziDuckPrice(10);
    // console.log(addProjectTx);

    // expect(await greeter.greet()).to.equal("Hello, world!");
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
