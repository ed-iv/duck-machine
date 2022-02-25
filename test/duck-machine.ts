/* eslint-disable node/no-extraneous-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import "hardhat-gas-reporter";
import { ChainsawProjects, TheAmazingTozziDuckMachine } from "../typechain";
import { Signer } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import duckData from "../duck-data/proofs.json";

describe("TheAmazingTozziDuckMachine", function () {
  let chainsawProjects: ChainsawProjects,
    theAmazingTozziDuckMachine: TheAmazingTozziDuckMachine,
    signer1: string | Signer | Provider,
    signer2: string | Signer | Provider;

  it("deploy and init the smart contracts", async function () {
    [signer1, signer2] = await ethers.getSigners();

    const ChainsawProjects = await ethers.getContractFactory(
      "ChainsawProjects",
      signer1
    );
    chainsawProjects = await ChainsawProjects.deploy();
    await chainsawProjects.deployed();

    const TheAmazingTozziDuckMachine = await ethers.getContractFactory(
      "TheAmazingTozziDuckMachine",
      signer1
    );
    theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(
      chainsawProjects.address
    );
    await theAmazingTozziDuckMachine.deployed();

    const addProjectTx = await chainsawProjects.addProject(
      "Tozzi Ducks",
      theAmazingTozziDuckMachine.address
    );
    await addProjectTx.wait();
  });

  it("set setting functions", async function () {
    const setTozziDuckPriceTx =
      await theAmazingTozziDuckMachine.setTozziDuckPrice(1);
    await setTozziDuckPriceTx.wait();
    expect(await theAmazingTozziDuckMachine.tozziDuckPrice()).to.equal(1);

    const setCustomDuckPriceTx =
      await theAmazingTozziDuckMachine.setCustomDuckPrice(1);
    await setCustomDuckPriceTx.wait();
    expect(await theAmazingTozziDuckMachine.customDuckPrice()).to.equal(1);

    const setMaxCustomDucksTx =
      await theAmazingTozziDuckMachine.setMaxCustomDucks(200);
    await setMaxCustomDucksTx.wait();
    expect(await theAmazingTozziDuckMachine.maxCustomDucks()).to.equal(200);

    const flipTozziStatusTx =
      await theAmazingTozziDuckMachine.flipTozziStatus();
    await flipTozziStatusTx.wait();
    expect(await theAmazingTozziDuckMachine.tozziDucksEnabled()).to.equal(true);

    const flipCustomStatusTx =
      await theAmazingTozziDuckMachine.flipCustomStatus();
    await flipCustomStatusTx.wait();
    expect(await theAmazingTozziDuckMachine.customDucksEnabled()).to.equal(
      true
    );
  });

  it("mint tozzi duck tokens", async function () {
    const data = Object.values(duckData);
    data.map(async (duck, index) => {
      const mintTozziDuckTx = await theAmazingTozziDuckMachine
        .connect(signer2)
        .mintTozziDuck(index, duck.webp, duck.proof, { value: 1 });
      await mintTozziDuckTx.wait();
      console.log("duck token id ===== ", index);
    });
  });

  it("mint custom duck tokens", async function () {
    const mintCustomDuckTx = await theAmazingTozziDuckMachine
      .connect(signer2)
      .mintCustomDuck(duckData[0].webp, { value: 1 });
    await mintCustomDuckTx.wait();
  });

  // it("burn renegade duck", async function () {
  //   const burnRenegadeDuckTx = await theAmazingTozziDuckMachine
  //     .connect(signer1)
  //     .burnRenegadeDuck(0, "reason");
  //   await burnRenegadeDuckTx.wait();
  // });

  it("call token uri", async function () {
    const tokenURITx = await theAmazingTozziDuckMachine
      .connect(signer2)
      .tokenURI(0);
    console.log("tokenURITx ===== ", tokenURITx);
  });
});
