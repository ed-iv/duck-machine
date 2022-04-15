/* eslint-disable node/no-extraneous-import */
import { ethers } from "hardhat";
import "hardhat-gas-reporter";
import { TheAmazingTozziDuckMachine } from "../typechain";
import duckData from "../duck-data/proofs.json";

describe("TheAmazingTozziDuckMachine", function () {
  let theAmazingTozziDuckMachine: TheAmazingTozziDuckMachine,
    signer1: any,
    signer2: any;

  it("deploy and init the smart contracts", async function () {
    [signer1, signer2] = await ethers.getSigners();

    console.log("signer1 ===== ", signer1.address); // admin
    console.log("signer2 ===== ", signer2.address); // owner

    const TheAmazingTozziDuckMachine = await ethers.getContractFactory(
      "TheAmazingTozziDuckMachine",
      signer1
    );
    theAmazingTozziDuckMachine = await TheAmazingTozziDuckMachine.deploy(
      "Test"
    );
    await theAmazingTozziDuckMachine.deployed();
    console.log(
      "TheAmazingTozziDuckMachine address ===== ",
      theAmazingTozziDuckMachine.address
    );
  });

  it("set setting functions", async function () {
    const setMachineSettingTx = await theAmazingTozziDuckMachine
      // .connect(signer2)
      .setMachineSetting({
        tozziDuckPrice: ethers.BigNumber.from(1),
        customDuckPrice: ethers.BigNumber.from(1),
        maxCustomDucks: ethers.BigNumber.from(200),
        tozziDucksEnabled: true,
        customDucksEnabled: true,
      });
    await setMachineSettingTx.wait();
  });

  it("mint tozzi duck tokens", async function () {
    const data = Object.values(duckData);
    data.map(async (duck, index) => {
      const mintTozziDuckTx = await theAmazingTozziDuckMachine
        .connect(signer2)
        .mintTozziDuck(index, duck.webp, duck.proof, { value: 1 });
      await mintTozziDuckTx.wait();
      // console.log("duck token id ===== ", index);
    });
  });

  it("mint custom duck tokens", async function () {
    let mintCustomDuckTx;
    mintCustomDuckTx = await theAmazingTozziDuckMachine
      .connect(signer2)
      .mintCustomDuck(duckData[0].webp, { value: 1 });
    await mintCustomDuckTx.wait();
    mintCustomDuckTx = await theAmazingTozziDuckMachine
      .connect(signer2)
      .mintCustomDuck(duckData[1].webp, { value: 1 });
    await mintCustomDuckTx.wait();
  });

  it("burn custom duck", async function () {
    const burnCustomDuckTx = await theAmazingTozziDuckMachine
      .connect(signer1)
      .burnRenegadeDuck(200, "Reason");
    await burnCustomDuckTx.wait();
  });

  it("call token uri", async function () {
    const tokenURITx = await theAmazingTozziDuckMachine
      .connect(signer2)
      .tokenURI(201);
    console.log("tokenURITx ===== ", tokenURITx);
  });

  it("withdraw", async function () {
    console.log(
      "machine balance ===== ",
      await ethers.provider.getBalance(theAmazingTozziDuckMachine.address)
    );
    const signer2Address = await signer2.getAddress();
    const withdrawTx = await theAmazingTozziDuckMachine
      .connect(signer1)
      .withdraw(signer2Address, 1);
    await withdrawTx.wait();
    console.log(
      "signer2 balance ===== ",
      await ethers.provider.getBalance(signer2Address)
    );
  });

  it("verify", async function () {
    const ownershipTokenId =
      await theAmazingTozziDuckMachine.OWNERSHIP_TOKEN_ID();
    console.log("Ownership Token Id ===== ", ownershipTokenId);
    const ownership = await theAmazingTozziDuckMachine.ownerOf(
      ownershipTokenId
    );
    console.log("ownership ===== ", ownership);
  });
});
