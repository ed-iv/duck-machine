import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";
import { TheAmazingTozziDuckMachine } from "../typechain";
import duckData from "../duck-data/proofs.json";
import { MachineConfig } from "../utils/types";
import { defaultConfig, allowConfig, enabledConfig } from "../utils/constants";

const ducks = Object.values(duckData);

const compareConfigs = (a: MachineConfig | any, b: MachineConfig | any) => {
  expect(a.tozziDuckPrice).to.be.eq(b.tozziDuckPrice);
  expect(a.customDuckPrice).to.be.eq(b.customDuckPrice);
  expect(a.maxCustomDucks).to.be.eq(b.maxCustomDucks);
  expect(a.tozziDuckMintStatus).to.be.eq(b.tozziDuckMintStatus);
  expect(a.customDuckMintStatus).to.be.eq(b.customDuckMintStatus);  
}

describe("Duck Machine", () => {

  const deployDuckMachineFixture = async () => {
    const [deployer, owner, user1, user2] = await ethers.getSigners();    
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    const duckMachine = await DuckMachine.deploy(defaultConfig, "Ownership Token URI");
    const ownershipTokenId = await duckMachine.OWNERSHIP_TOKEN_ID();
    await duckMachine.transferFrom(deployer.address, owner.address, ownershipTokenId);

    return { deployer, owner, user1, user2, duckMachine, ownershipTokenId };
  }

  const enabledDuckMachineFixture = async () => {
    const [deployer, owner, user1, user2] = await ethers.getSigners();    
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    let duckMachine = await DuckMachine.deploy(defaultConfig, "Ownership Token URI");
    const ownershipTokenId = await duckMachine.OWNERSHIP_TOKEN_ID();
    await duckMachine.transferFrom(deployer.address, owner.address, ownershipTokenId);

    await duckMachine.connect(owner).setMachineConfig(enabledConfig);
    duckMachine = duckMachine.connect(owner);
    return { deployer, owner, user1, user2, duckMachine, ownershipTokenId };
  }

  describe("Machine Configuration", () => {
    it("Initializes the machine with correct default configuration", async () => {
      const { owner, duckMachine, ownershipTokenId }  = await loadFixture(deployDuckMachineFixture);
      const currentOwner = await duckMachine.ownerOf(ownershipTokenId);
      expect(currentOwner).to.be.eq(owner.address);
      
      const config = await duckMachine.machineConfig();      
      compareConfigs(config, defaultConfig);
    });

    it("Allows machine owner to modify configuration", async () => {
      const { owner, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      await expect(duckMachine.connect(owner).setMachineConfig(enabledConfig))
        .to.emit(duckMachine, "MachineConfigUpdated")
        .withArgs(owner.address, ...Object.values(enabledConfig));

      const config = await duckMachine.machineConfig();
      compareConfigs(config, enabledConfig);      
    });

    it("Reverts if unauthorized user tries to modify configuration", async () => {
      const { user1, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      // Deployer cannot update since ownership token has been transferred
      await expect(
        duckMachine.setMachineConfig(enabledConfig)
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");
      // Random user shouldn't be able to do this, obv
      await expect(
        duckMachine.connect(user1).setMachineConfig(enabledConfig)
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");

      const config = await duckMachine.machineConfig();
      compareConfigs(config, defaultConfig);
    });

    it("Allows machine owner to set duck allowances", async () => {
      const { user1, duckMachine }  = await loadFixture(enabledDuckMachineFixture);
      
      let allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      
      await expect(duckMachine.setDuckAllowance(user1.address, 2, 1))
        .not.to.be.reverted;
      
      allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(2);
      expect(allowance.customDuckAllowance).to.be.eq(1);

      // Revoke allowance
      await expect(duckMachine.setDuckAllowance(user1.address, 0, 0))
        .not.to.be.reverted;
      allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
    });

    it("Reverts if unauthorized user tries to set duck allowances", async () => {
      const { user1, duckMachine }  = await loadFixture(enabledDuckMachineFixture);      
      await expect(
        duckMachine.connect(user1).setDuckAllowance(user1.address, 100, 100)
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");
      const allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
    });
  });

  describe("Tozzi Duck Minting", () => {    
    it("Allows users to mint tozzi ducks", async () => {
      const { user1, duckMachine }  = await loadFixture(enabledDuckMachineFixture);          
      await Promise.all(
        ducks.map(async (duck, index) => {          
          await expect(duckMachine.connect(user1).mintTozziDuck(
              index, 
              duck.webp, 
              duck.proof, 
              { value: enabledConfig.tozziDuckPrice }
          )).to.emit(duckMachine, "DuckMinted")
            .withArgs(index, user1.address, 0, enabledConfig.tozziDuckPrice);        
        })
      );
      expect(await duckMachine.totalSupply()).to.be.eq(201);
      expect(await duckMachine.balanceOf(user1.address)).to.be.eq(200);      
    });

    it("Reverts when tozzi duck minting is disabled", async () => {
      const { user1, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      
      const config = await duckMachine.machineConfig();
      compareConfigs(config, defaultConfig);
      await expect(
        duckMachine.connect(user1).mintTozziDuck(
          0, 
          duckData[0].webp, 
          duckData[0].proof, 
          { value: defaultConfig.tozziDuckPrice })
      ).to.be.revertedWithCustomError(duckMachine, "MintingDisabled");
    });

    it("Allows users with duck allowances to mint tozzi ducks", async () => {
      const { owner, user1, duckMachine }  = await loadFixture(deployDuckMachineFixture);      
      await expect(duckMachine.connect(owner).setMachineConfig(allowConfig))
        .to.emit(duckMachine, "MachineConfigUpdated")
        .withArgs(owner.address, ...Object.values(allowConfig));
      
      await expect(duckMachine.connect(user1).mintTozziDuck(
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: allowConfig.tozziDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "InsufficientDuckAllowance");

      await expect(duckMachine.connect(owner).setDuckAllowance(user1.address, 2, 0))
        .not.to.be.reverted;

      let allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(2);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      
      await expect(duckMachine.connect(user1).mintTozziDuck(
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: allowConfig.tozziDuckPrice }
      )).not.to.be.reverted;

      expect(await duckMachine.ownerOf(0)).to.be.eq(user1.address);
      allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(1);
      expect(allowance.customDuckAllowance).to.be.eq(0);

      await expect(duckMachine.connect(user1).mintTozziDuck(
        1, 
        duckData[1].webp, 
        duckData[1].proof, 
        { value: allowConfig.tozziDuckPrice }
      )).not.to.be.reverted;

      expect(await duckMachine.ownerOf(1)).to.be.eq(user1.address);
      allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(3);
    });
  });

  describe("Custom Duck Minting", () => {    
    it("Allows users to mint custom ducks", async () => {
      const { owner, user1, duckMachine }  = await loadFixture(deployDuckMachineFixture);     
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);

      // Mint 10 custom ducks (re-uses tozzi duck image data)
      await Promise.all(
        ducks.map(async (duck, index) => {
          if (index >= 10) return;
          await expect(
            duckMachine.connect(user1).mintCustomDuck(
              duck.webp, { value: enabledConfig.customDuckPrice })
          ).to.emit(duckMachine, "DuckMinted")
          .withArgs(200 + index, user1.address, 1, enabledConfig.customDuckPrice);          
        })
      );

      expect(await duckMachine.balanceOf(user1.address)).to.be.eq(10);
      expect(await duckMachine.totalSupply()).to.be.eq(11);
      
      for (let i = 0; i < 10; i++) {
        expect(await duckMachine.ownerOf(200 + i)).to.be.eq(user1.address);
        expect(await duckMachine.duckCreators(200 + i))
          .to.be.eq(user1.address);
      } 
    });

    it("Reverts when custom duck minting is disabled", async () => {
      const { user1, duckMachine }  = await loadFixture(deployDuckMachineFixture);           
      const config = await duckMachine.machineConfig();
      compareConfigs(config, defaultConfig);

      await expect(duckMachine.connect(user1).mintCustomDuck(
          ducks[0].webp, { value: defaultConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "MintingDisabled");
    });

    it("Allows users with duck allowances to mint custom ducks", async () => {
      const { owner, user1, duckMachine }  = await loadFixture(deployDuckMachineFixture);      
      await expect(duckMachine.connect(owner).setMachineConfig(allowConfig))
        .to.emit(duckMachine, "MachineConfigUpdated")
        .withArgs(owner.address, ...Object.values(allowConfig));

      await expect(duckMachine.connect(user1).mintCustomDuck(
        ducks[0].webp, { value: allowConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "InsufficientDuckAllowance");
      
      await duckMachine.connect(owner).setDuckAllowance(user1.address, 0, 2);
      let allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(2);
      
      await expect(duckMachine.connect(user1).mintCustomDuck(
        ducks[0].webp, {value: allowConfig.customDuckPrice }
      )).to.emit(duckMachine, "DuckMinted")
        .withArgs(200, user1.address, 1, allowConfig.customDuckPrice);
      expect(await duckMachine.ownerOf(200)).to.be.eq(user1.address);
      
      allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(1);
      
      await expect(duckMachine.connect(user1).mintCustomDuck(
        ducks[1].webp, { value: allowConfig.customDuckPrice })
      ).to.emit(duckMachine, "DuckMinted")
      .withArgs(201, user1.address, 1, allowConfig.customDuckPrice);

      expect(await duckMachine.ownerOf(201)).to.be.eq(user1.address);
      allowance = await duckMachine.duckAllowances(user1.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(3);
    });

    it("Reverts on custom duck collisions", async () => {
      const { user1, duckMachine }  = await loadFixture(enabledDuckMachineFixture);

      await expect(duckMachine.connect(user1).mintCustomDuck(
        ducks[0].webp, { value: enabledConfig.customDuckPrice }
      )).not.to.be.reverted;

      await expect(duckMachine.connect(user1).mintCustomDuck(
        ducks[0].webp, { value: enabledConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "DuckAlreadyExists");
    });
  });
});
