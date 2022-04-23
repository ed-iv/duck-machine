import { expect } from "chai";
import { ethers } from "hardhat";
import { TheAmazingTozziDuckMachine } from "../typechain";
import "hardhat-gas-reporter";
import duckData from "../duck-data/proofs.json";
import { BigNumber, Contract, Signer, utils } from "ethers";

const ducks = Object.values(duckData);
const testDuck = ducks[11]; // random
const MINTSTATUS_ENABLED = BigNumber.from(0);
const MINTSTATUS_DISABLED = BigNumber.from(1);
const MINTSTATUS_WHITELIST = BigNumber.from(2);
const defaultConfig = {
  tozziDuckPrice: utils.parseEther("0.1"), // tozziDuckPrice
  customDuckPrice: utils.parseEther("0.2"), // customDuckPrice
  maxCustomDucks: BigNumber.from(0), // maxCustomDucks
  tozziDuckMintStatus: MINTSTATUS_DISABLED, // tozziDuckMintStatus
  customDuckMintStatus: MINTSTATUS_DISABLED, // tozziDuckMintStatus
};

const testConfig = {
  tozziDuckPrice: utils.parseEther("0.2"),
  customDuckPrice: utils.parseEther("0.3"),
  maxCustomDucks: BigNumber.from(20),
  tozziDuckMintStatus: MINTSTATUS_ENABLED,
  customDuckMintStatus: MINTSTATUS_DISABLED, 
}

const whiteListConfig = {
  ...testConfig,
  tozziDuckMintStatus: MINTSTATUS_WHITELIST,
  customDuckMintStatus: MINTSTATUS_WHITELIST, 
}

let deployer: Signer,
  secondOwner: Signer,
  user1: Signer,
  user2: Signer,    
  duckMachine: TheAmazingTozziDuckMachine;

describe("TheAmazingTozziDuckMachine", () => {
  before(async () => {
    [deployer, secondOwner, user1, user2] = await ethers.getSigners();
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    duckMachine = await DuckMachine.deploy(defaultConfig, "Ownership Token URI");
    await duckMachine.deployed();    
  });

  describe("Machine Configuration", () => {  
    it("Initializes the machine with correct default configuration", async () => {
      const owner = await duckMachine.ownerOf(BigNumber.from(420));
      expect(owner).to.be.eq(await deployer.getAddress());
      const config = await duckMachine.machineConfig();
      expect(config[0]).to.be.eq(defaultConfig.tozziDuckPrice);
      expect(config[1]).to.be.eq(defaultConfig.customDuckPrice);
      expect(config[2]).to.be.eq(defaultConfig.maxCustomDucks);
      expect(config[3]).to.be.eq(defaultConfig.tozziDuckMintStatus);
      expect(config[4]).to.be.eq(defaultConfig.customDuckMintStatus);    
    });

    it ("Allows owner to modify configuration", async () => {
      await expect(duckMachine.setMachineConfig(testConfig)).not.to.be.reverted;
      const config = await duckMachine.machineConfig();
      expect(config[0]).to.be.eq(testConfig.tozziDuckPrice);
      expect(config[1]).to.be.eq(testConfig.customDuckPrice);
      expect(config[2]).to.be.eq(testConfig.maxCustomDucks);
      expect(config[3]).to.be.eq(testConfig.tozziDuckMintStatus);
      expect(config[4]).to.be.eq(testConfig.customDuckMintStatus);    
      const block = await ethers.provider.getBlockNumber();        
      const events = await duckMachine.queryFilter(
        duckMachine.filters.MachineConfigUpdated(null, null),
        block
      );
      expect(events.length).eq(1);
      const logDescription = duckMachine.interface.parseLog(events[0]);      
      expect(logDescription.args.who).to.be.eq(await deployer.getAddress());      
      expect(logDescription.args.tozziDuckPrice).to.be.eq(testConfig.tozziDuckPrice);
      expect(logDescription.args.customDuckPrice).to.be.eq(testConfig.customDuckPrice);
      expect(logDescription.args.maxCustomDucks).to.be.eq(testConfig.maxCustomDucks);
      expect(logDescription.args.tozziDuckMintStatus).to.be.eq(testConfig.tozziDuckMintStatus);
      expect(logDescription.args.customDuckMintStatus).to.be.eq(testConfig.customDuckMintStatus);    
    });

    it ("Reverts if unauthorized user tries to modify configuration", async () => {
      await expect(duckMachine.connect(user1).setMachineConfig(defaultConfig)).to.be.revertedWith('Unauthorized');
      const config = await duckMachine.machineConfig();
      expect(config[0]).to.be.eq(testConfig.tozziDuckPrice);
      expect(config[1]).to.be.eq(testConfig.customDuckPrice);
      expect(config[2]).to.be.eq(testConfig.maxCustomDucks);
      expect(config[3]).to.be.eq(testConfig.tozziDuckMintStatus);
      expect(config[4]).to.be.eq(testConfig.customDuckMintStatus);    
    });

    it ("Allows owner to set duck allowances", async () => {
      const user1Address = await user1.getAddress();
      let user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(BigNumber.from(0));
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(BigNumber.from(0));
      
      // Set allowance
      await expect(duckMachine.setDuckAllowance(user1Address, BigNumber.from(2), BigNumber.from(1))).not.to.be.reverted;
      user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(BigNumber.from(2));
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(BigNumber.from(1));
      
      // Revoke allowance
      await expect(duckMachine.setDuckAllowance(user1Address, BigNumber.from(0), BigNumber.from(0))).not.to.be.reverted;
      user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(BigNumber.from(0));
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(BigNumber.from(0));      
    });

    it ("Reverts if unauthorized user tries to set duck allowances", async () => {
      const user1Address = await user1.getAddress();
      await expect(duckMachine.connect(user1).setDuckAllowance(user1Address, BigNumber.from(100), BigNumber.from(100)))
        .to.be.revertedWith("Unauthorized");
      const user1DuckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(user1DuckAllowance.tozziDuckAllowance).to.be.eq(BigNumber.from(0));
      expect(user1DuckAllowance.customDuckAllowance).to.be.eq(BigNumber.from(0));            
    });
  })

  describe("Tozzi Duck Minting", () => {
    it ("Allows users to mint tozzi ducks when minting is enabled", async() => {
      const user2Address = await user2.getAddress();
      expect(await duckMachine.totalSupply()).to.be.eq(1);
      expect(await duckMachine.tokenByIndex(0)).to.be.eq(420);

      await Promise.all(ducks.map(async (duck, index) => {
        if (index > 197) return;
        await expect(
            duckMachine.connect(user2).mintTozziDuck(
            index,
            duck.webp,
            duck.proof,
            { value: utils.parseEther("0.2") }
          )
        ).not.to.be.reverted;
        })
      );
      expect (await duckMachine.totalSupply()).to.be.eq(199);
      for (let i = 0; i < 198; i++) {
        expect(await duckMachine.ownerOf(i)).to.be.eq(user2Address)
      }      
      const events = await duckMachine.queryFilter(
        duckMachine.filters.DuckMinted(null, null, null, null)        
      );
      expect(events.length).eq(198);
      const logDescription = duckMachine.interface.parseLog(events[events.length-1]);
      expect(logDescription.args.tokenId).to.be.eq(197);
      expect(logDescription.args.who).to.be.eq(user2Address);
      expect(logDescription.args.duckType).to.be.eq(0);
      expect(logDescription.args.price).to.be.eq(utils.parseEther("0.2"));
    });

    it ("Reverts when minting is disabled", async () => {
      await expect(duckMachine.setMachineConfig(defaultConfig)).not.to.be.reverted;
      await expect(
        duckMachine.connect(user2).mintTozziDuck(
          198,
          duckData[198].webp,
          duckData[198].proof,
          { value: utils.parseEther("0.2") }
        )
      ).to.be.revertedWith("MintingDisabled(0)");      
    });

    it ("Allows whitelisted users to mint tozzi ducks", async () => {
      const user1Address = await user1.getAddress();
      await expect(duckMachine.setMachineConfig(whiteListConfig)).not.to.be.reverted;
      const config = await duckMachine.machineConfig();
      expect(config[3]).to.be.eq(MINTSTATUS_WHITELIST);
      await expect(
        duckMachine.connect(user1).mintTozziDuck(
            198,
            duckData[198].webp,
            duckData[198].proof,
            { value: utils.parseEther("0.2") }
          )
      ).to.be.revertedWith("InsufficientDuckAllowance"); 
      await expect(duckMachine.setDuckAllowance(user1Address, BigNumber.from(2), BigNumber.from(0)))
        .not.to.be.reverted;
      let duckAllowance = await duckMachine.duckAllowances(user1Address);
      await expect(duckAllowance.tozziDuckAllowance).to.be.eq(2);
      expect(await duckMachine.totalSupply()).to.be.eq(199);
      await expect(duckMachine.ownerOf(198)).to.be.reverted;
      await expect(duckMachine.ownerOf(199)).to.be.reverted;
      await expect(
        duckMachine.connect(user1).mintTozziDuck(
            198,
            duckData[198].webp,
            duckData[198].proof,
            { value: utils.parseEther("0.2") }
          )
      ).not.to.be.reverted;    
      expect(await duckMachine.ownerOf(198)).to.be.eq(user1Address);
      duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(await duckAllowance.tozziDuckAllowance).to.be.eq(1);
      await expect(
        duckMachine.connect(user1).mintTozziDuck(
            199,
            duckData[199].webp,
            duckData[199].proof,
            { value: utils.parseEther("0.2") }
          )
      ).not.to.be.reverted;    
      expect(await duckMachine.ownerOf(199)).to.be.eq(user1Address);
      duckAllowance = await duckMachine.duckAllowances(user1Address);
      expect(await duckAllowance.tozziDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(201);
      
    });

  });

  // TODO verify cannot mint custom duck that is the same as tozzi duck

  describe("Custom Duck Minting", () => {
    it ("Allows users to mint custom ducks when minting is enabled", async() => {     
    });

    it ("Reverts when minting is disabled", async () => {      
    });

    it ("Allows whitelisted users to mint tozzi ducks", async () => {
    });
  });
});