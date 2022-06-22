/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import { TheAmazingTozziDuckMachine } from "../typechain";
import "hardhat-gas-reporter";
import duckData from "../duck-data/proofs.json";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, utils } from "ethers";
import { enabledConfig } from '../utils/constants';
import { mintTozziDuck, mintCustomDuck } from '../utils/helpers';

let machineOwner: SignerWithAddress,
  user1: SignerWithAddress,
  user2: SignerWithAddress,
  duckMachine: TheAmazingTozziDuckMachine;



describe("TheAmazingTozziDuckMachine Social Mechanics", () => {
  before(async () => {
    [machineOwner, user1, user2] = await ethers.getSigners();
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    duckMachine = await DuckMachine.deploy(enabledConfig, "");
    await duckMachine.deployed();
    // Mint Tozzi Duck 0
    await mintTozziDuck(0, duckMachine);
    // Mint Custom Duck    
    await mintCustomDuck(duckData[1].webp, duckMachine, user1);
  });

  describe("Duck Status", () => {
    it("Owner can define new duck status", async () => {            
      expect(await duckMachine.ownerOf(0)).to.be.eq(machineOwner.address)
      expect(await duckMachine.ownerOf(200)).to.be.eq(user1.address)
    });

    // it("Reverts if status set to invalid option", async () => {            
      
    // });

    // it("Reverts if non-owner sets status", async () => {            
      
    // });

    // it("Allows duck owner to set valid status", async () => {            
      
    // });
  });
});
