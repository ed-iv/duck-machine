/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import { TheAmazingTozziDuckMachine } from "../typechain";
import "hardhat-gas-reporter";
import duckData from "../duck-data/proofs.json";
import { BigNumber, Signer, utils } from "ethers";

const ducks = Object.values(duckData);
const MINTSTATUS_ENABLED = 0;
const MINTSTATUS_DISABLED = 1;
const MINTSTATUS_WHITELIST = 2;

const disableConfig = {
  tozziDuckPrice: utils.parseEther("0.1"), // tozziDuckPrice
  customDuckPrice: utils.parseEther("0.2"), // customDuckPrice
  maxCustomDucks: 200, // maxCustomDucks
  tozziDuckMintStatus: MINTSTATUS_DISABLED, // tozziDuckMintStatus
  customDuckMintStatus: MINTSTATUS_DISABLED, // tozziDuckMintStatus
};

const enableConfig = {
  ...disableConfig,
  tozziDuckMintStatus: MINTSTATUS_ENABLED,
  customDuckMintStatus: MINTSTATUS_ENABLED,
};

const whitelistConfig = {
  ...disableConfig,
  tozziDuckMintStatus: MINTSTATUS_WHITELIST,
  customDuckMintStatus: MINTSTATUS_WHITELIST,
};

let deployer: Signer,
  user1: Signer,
  user2: Signer,
  duckMachine: TheAmazingTozziDuckMachine,
  ownershipTokenId: BigNumber;

describe("test TheAmazingTozziDuckMachine", () => {
  before(async () => {
    [deployer, user1, user2] = await ethers.getSigners();
    const DuckMachine = await ethers.getContractFactory(
      "TheAmazingTozziDuckMachine"
    );
    duckMachine = await DuckMachine.deploy(
      disableConfig,
      "Ownership Token URI"
    );
    await duckMachine.deployed();
    ownershipTokenId = await duckMachine.OWNERSHIP_TOKEN_ID();
    expect(await duckMachine.totalSupply()).to.be.eq(1);
    expect(await duckMachine.tokenByIndex(0)).to.be.eq(ownershipTokenId);
  });

  describe("Misc", () => {
    it("Can convert an address to a string", async () => {
      const user1Address = await user1.getAddress();
      expect(await duckMachine.addressToString(user1Address)).to.be.eq(user1Address.toLowerCase());
    });    
  });

  describe("Machine Configuration", () => {
    it("Initializes the machine with correct default configuration", async () => {
      const owner = await duckMachine.ownerOf(ownershipTokenId);
      expect(owner).to.be.eq(await deployer.getAddress());
      const config = await duckMachine.machineConfig();
      expect(config[0]).to.be.eq(disableConfig.tozziDuckPrice);
      expect(config[1]).to.be.eq(disableConfig.customDuckPrice);
      expect(config[2]).to.be.eq(disableConfig.maxCustomDucks);
      expect(config[3]).to.be.eq(disableConfig.tozziDuckMintStatus);
      expect(config[4]).to.be.eq(disableConfig.customDuckMintStatus);
    });

    it("Allows deployer to modify configuration", async () => {
      await expect(duckMachine.setMachineConfig(enableConfig)).not.to.be
        .reverted;
      const config = await duckMachine.machineConfig();
      expect(config[0]).to.be.eq(enableConfig.tozziDuckPrice);
      expect(config[1]).to.be.eq(enableConfig.customDuckPrice);
      expect(config[2]).to.be.eq(enableConfig.maxCustomDucks);
      expect(config[3]).to.be.eq(enableConfig.tozziDuckMintStatus);
      expect(config[4]).to.be.eq(enableConfig.customDuckMintStatus);
      const block = await ethers.provider.getBlockNumber();
      const events = await duckMachine.queryFilter(
        duckMachine.filters.MachineConfigUpdated(),
        block
      );
      expect(events.length).eq(1);
      const logDescription = duckMachine.interface.parseLog(events[0]);
      expect(logDescription.args.who).to.be.eq(await deployer.getAddress());
      expect(logDescription.args.tozziDuckPrice).to.be.eq(
        enableConfig.tozziDuckPrice
      );
      expect(logDescription.args.customDuckPrice).to.be.eq(
        enableConfig.customDuckPrice
      );
      expect(logDescription.args.maxCustomDucks).to.be.eq(
        enableConfig.maxCustomDucks
      );
      expect(logDescription.args.tozziDuckMintStatus).to.be.eq(
        enableConfig.tozziDuckMintStatus
      );
      expect(logDescription.args.customDuckMintStatus).to.be.eq(
        enableConfig.customDuckMintStatus
      );
    });

    it("Reverts if unauthorized user tries to modify configuration", async () => {
      await expect(
        duckMachine.connect(user1).setMachineConfig(disableConfig)
      ).to.be.revertedWith("Unauthorized");
      const config = await duckMachine.machineConfig();
      expect(config[0]).to.be.eq(enableConfig.tozziDuckPrice);
      expect(config[1]).to.be.eq(enableConfig.customDuckPrice);
      expect(config[2]).to.be.eq(enableConfig.maxCustomDucks);
      expect(config[3]).to.be.eq(enableConfig.tozziDuckMintStatus);
      expect(config[4]).to.be.eq(enableConfig.customDuckMintStatus);
    });

    it("Allows deployer to set duck allowances", async () => {
      const user1Address = await user1.getAddress();
      let user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(0);
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(0);
      // Set allowance
      await expect(duckMachine.setDuckAllowance(user1Address, 2, 1)).not.to.be
        .reverted;
      user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(2);
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(1);
      // Revoke allowance
      await expect(duckMachine.setDuckAllowance(user1Address, 0, 0)).not.to.be
        .reverted;
      user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(0);
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(0);
    });

    it("Reverts if unauthorized user tries to set duck allowances", async () => {
      const user1Address = await user1.getAddress();
      await expect(
        duckMachine.connect(user1).setDuckAllowance(user1Address, 100, 100)
      ).to.be.revertedWith("Unauthorized");
      const user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(0);
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(0);
    });
  });

  describe("Tozzi Duck Minting", () => {
    it("Allows users to mint tozzi ducks when minting is enabled", async () => {
      await Promise.all(
        ducks.map(async (duck, index) => {
          if (index > 197) return;
          await expect(
            duckMachine
              .connect(user2)
              .mintTozziDuck(index, duck.webp, duck.proof, {
                value: enableConfig.tozziDuckPrice,
              })
          ).not.to.be.reverted;
        })
      );
      expect(await duckMachine.totalSupply()).to.be.eq(199);
      const user2Address = await user2.getAddress();
      for (let i = 0; i < 198; i++) {
        expect(await duckMachine.ownerOf(i)).to.be.eq(user2Address);
      }
      const events = await duckMachine.queryFilter(
        duckMachine.filters.DuckMinted()
      );
      expect(events.length).eq(198);
      const logDescription = duckMachine.interface.parseLog(
        events[events.length - 1]
      );
      expect(logDescription.args.tokenId).to.be.eq(197);
      expect(logDescription.args.who).to.be.eq(user2Address);
      expect(logDescription.args.duckType).to.be.eq(0);
      expect(logDescription.args.price).to.be.eq(enableConfig.tozziDuckPrice);
    });

    it("Reverts when tozzi duck minting is disabled", async () => {
      await expect(
        duckMachine.connect(deployer).setMachineConfig(disableConfig)
      ).not.to.be.reverted;
      const config = await duckMachine.machineConfig();
      expect(config[3]).to.be.eq(MINTSTATUS_DISABLED);
      await expect(
        duckMachine
          .connect(user2)
          .mintTozziDuck(198, duckData[198].webp, duckData[198].proof, {
            value: disableConfig.tozziDuckPrice,
          })
      ).to.be.revertedWith("MintingDisabled(0)");
    });

    it("Allows whitelisted users to mint tozzi ducks", async () => {
      const user1Address = await user1.getAddress();
      await expect(duckMachine.setMachineConfig(whitelistConfig)).not.to.be
        .reverted;
      const config = await duckMachine.machineConfig();
      expect(config[3]).to.be.eq(MINTSTATUS_WHITELIST);
      await expect(
        duckMachine
          .connect(user1)
          .mintTozziDuck(198, duckData[198].webp, duckData[198].proof, {
            value: whitelistConfig.tozziDuckPrice,
          })
      ).to.be.revertedWith("InsufficientDuckAllowance");
      await expect(duckMachine.setDuckAllowance(user1Address, 2, 0)).not.to.be
        .reverted;
      let duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(duckAllowance.tozziDuckAllowance).to.be.eq(2);
      expect(await duckMachine.totalSupply()).to.be.eq(199);
      await expect(duckMachine.ownerOf(198)).to.be.reverted;
      await expect(duckMachine.ownerOf(199)).to.be.reverted;
      await expect(
        duckMachine
          .connect(user1)
          .mintTozziDuck(198, duckData[198].webp, duckData[198].proof, {
            value: whitelistConfig.tozziDuckPrice,
          })
      ).not.to.be.reverted;
      expect(await duckMachine.ownerOf(198)).to.be.eq(user1Address);
      duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(duckAllowance.tozziDuckAllowance).to.be.eq(1);
      await expect(
        duckMachine
          .connect(user1)
          .mintTozziDuck(199, duckData[199].webp, duckData[199].proof, {
            value: whitelistConfig.tozziDuckPrice,
          })
      ).not.to.be.reverted;
      expect(await duckMachine.ownerOf(199)).to.be.eq(user1Address);
      duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(duckAllowance.tozziDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(201);
    });
  });

  describe("Custom Duck Minting", () => {
    it("Allows users to mint custom ducks when minting is enabled", async () => {
      await expect(duckMachine.setMachineConfig(enableConfig)).not.to.be
        .reverted;
      await Promise.all(
        ducks.map(async (duck, index) => {
          if (index >= 10) return;
          await expect(
            duckMachine.connect(user2).mintCustomDuck(duck.webp, {
              value: enableConfig.customDuckPrice,
            })
          ).not.to.be.reverted;
        })
      );
      expect(await duckMachine.totalSupply()).to.be.eq(211);
      const user2Address = await user2.getAddress();
      for (let i = 0; i < 10; i++) {
        expect(await duckMachine.ownerOf(200 + i)).to.be.eq(user2Address);
        expect(await duckMachine.duckCreators(200 + i)).to.be.eq('foo');
      }
      const events = await duckMachine.queryFilter(
        duckMachine.filters.DuckMinted()
      );
      expect(events.length).eq(210);
      const logDescription = duckMachine.interface.parseLog(
        events[events.length - 1]
      );
      expect(logDescription.args.tokenId).to.be.eq(209);
      expect(logDescription.args.who).to.be.eq(user2Address);
      expect(logDescription.args.duckType).to.be.eq(1);
      expect(logDescription.args.price).to.be.eq(enableConfig.customDuckPrice);
    });

    it("Reverts when custom duck minting is disabled", async () => {
      await expect(duckMachine.setMachineConfig(disableConfig)).not.to.be
        .reverted;
      const config = await duckMachine.machineConfig();
      expect(config[4]).to.be.eq(MINTSTATUS_DISABLED);
      await expect(
        duckMachine.connect(user2).mintCustomDuck(ducks[0].webp, {
          value: disableConfig.customDuckPrice,
        })
      ).to.be.revertedWith("MintingDisabled(1)");
    });

    it("Allows whitelisted users to mint custom ducks", async () => {
      const user1Address = await user1.getAddress();
      await expect(duckMachine.setMachineConfig(whitelistConfig)).not.to.be
        .reverted;
      const config = await duckMachine.machineConfig();
      expect(config[4]).to.be.eq(MINTSTATUS_WHITELIST);
      await expect(
        duckMachine.connect(user1).mintCustomDuck(`${ducks[0].webp}0`, {
          value: whitelistConfig.customDuckPrice,
        })
      ).to.be.revertedWith("InsufficientDuckAllowance");
      await expect(duckMachine.setDuckAllowance(user1Address, 0, 2)).not.to.be
        .reverted;
      let duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(duckAllowance.customDuckAllowance).to.be.eq(2);
      expect(await duckMachine.totalSupply()).to.be.eq(211);
      await expect(duckMachine.ownerOf(211)).to.be.reverted;
      await expect(duckMachine.ownerOf(212)).to.be.reverted;
      await expect(
        duckMachine.connect(user1).mintCustomDuck(`${ducks[1].webp}1`, {
          value: whitelistConfig.customDuckPrice,
        })
      ).not.to.be.reverted;
      expect(await duckMachine.ownerOf(210)).to.be.eq(user1Address);
      duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(duckAllowance.customDuckAllowance).to.be.eq(1);
      await expect(
        duckMachine.connect(user1).mintCustomDuck(`${ducks[2].webp}2`, {
          value: whitelistConfig.customDuckPrice,
        })
      ).not.to.be.reverted;
      expect(await duckMachine.ownerOf(211)).to.be.eq(user1Address);
      duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(duckAllowance.tozziDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(213);
    });
  });
});
