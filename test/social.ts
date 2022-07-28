import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";
import { TheAmazingTozziDuckMachine } from "../typechain";
import duckData from "../duck-data/proofs.json";
import { MachineConfig } from "../utils/types";
import { defaultConfig, allowConfig, enabledConfig } from "../utils/constants";
import { mintTozziDuck, mintCustomDuck, parseMetadata } from '../utils/helpers';

const emptyBytes32 = utils.formatBytes32String('') 
const testName = utils.formatBytes32String('Duck Name');
const testStatus = utils.formatBytes32String('Chillin');
const newName = utils.formatBytes32String('Quacker');
const newStatus = utils.formatBytes32String('Quackin');
const genesisTitle = utils.formatBytes32String('Genesis Duck');

describe("Social Mechanics", () => {
  const deployDuckMachineFixture = async () => {
    const [deployer, owner, user] = await ethers.getSigners();    
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    let duckMachine = await DuckMachine.deploy(defaultConfig, "Ownership Token URI");
    const ownershipTokenId = await duckMachine.OWNERSHIP_TOKEN_ID();
    
    await duckMachine.transferFrom(deployer.address, owner.address, ownershipTokenId);
    await duckMachine.connect(owner).setMachineConfig(enabledConfig);

    await mintTozziDuck(0, duckMachine.connect(user));
    await mintCustomDuck(duckData[1].webp, duckMachine.connect(user), user);
    duckMachine = duckMachine.connect(owner);
    return { deployer, owner, user, duckMachine, ownershipTokenId };
  }

  describe("Setting duck profiles", () => {
    it("Duck owner can set profile of minted duck", async () => {    
      const { duckMachine, user }  = await loadFixture(deployDuckMachineFixture);
      let profile = await duckMachine.duckProfiles(0);
      expect(profile.name).to.be.eq(emptyBytes32);
      expect(profile.status).to.be.eq(emptyBytes32);
      expect(profile.description).to.be.eq("");

      await expect(duckMachine.connect(user).setDuckProfile(0, testName, testStatus, 'duck profile'))
        .to.emit(duckMachine, "DuckProfileUpdated")
        .withArgs(0, testName, testStatus, 'duck profile');

      profile = await duckMachine.duckProfiles(0);
      expect(utils.parseBytes32String(profile.name)).to.be.eq('Duck Name');
      expect(utils.parseBytes32String(profile.status)).to.be.eq('Chillin');
      expect(profile.description).to.be.eq('duck profile');
      let metadata = parseMetadata(await duckMachine.tokenURI(0));      
    });
    
    it("Reverts if unauthorized user tries to set profile", async () => {    
      const { duckMachine, owner, deployer }  = await loadFixture(deployDuckMachineFixture);

      await expect(
        duckMachine.connect(owner).setDuckProfile(0, newName, newStatus, 'this is my duck now')
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");

      await expect(
        duckMachine.connect(deployer).setDuckProfile(0, newName, newStatus, 'this is my duck now')
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");
    });

    it("Duck profile determines tokenURI", async () => {      
      const { duckMachine, user }  = await loadFixture(deployDuckMachineFixture);
      await duckMachine.connect(user).setDuckProfile(0, testName, testStatus, 'duck profile');
      let metadata = parseMetadata(await duckMachine.tokenURI(0));      
      let status = metadata.attributes.find((a: any) => a.trait_type === 'Status');
      expect(metadata.name).to.be.eq('Duck Name');
      expect(status.value).to.be.eq('Chillin');
      expect(metadata.description).to.be.eq('duck profile');

      await duckMachine.connect(user).setDuckProfile(0, newName, newStatus, 'updated profile');
      metadata = parseMetadata(await duckMachine.tokenURI(0));
      status = metadata.attributes.find((a: any) => a.trait_type === 'Status');
      expect(metadata.name).to.be.eq('Quacker');
      expect(status.value).to.be.eq('Quackin');
      expect(metadata.description).to.be.eq('updated profile');

      metadata = parseMetadata(await duckMachine.tokenURI(200));
      status = metadata.attributes.find((a: any) => a.trait_type === 'Status');
      expect(status.value).to.be.eq('Probation');
    });
  });

  // describe("Duck Titles", () => {
  //   it("Allows machine owner to set title for existing duck", async () => {
  //     let metadata = parseMetadata(await duckMachine.tokenURI(0));
  //     let title = metadata.attributes.find((a: any) => a.trait_type === 'Title');
  //     expect(title).to.be.eq(undefined);
  //     expect(await duckMachine.duckTitles(0)).to.be.eq(emptyBytes32);      
      
  //     await expect(duckMachine.setDuckTitle(0, genesisTitle)).not.to.be.reverted;
  //     metadata = parseMetadata(await duckMachine.tokenURI(0));
  //     console.log(metadata);
  //     title = metadata.attributes.find((a: any) => a.trait_type === 'Title');
  //     expect(title.value).to.be.eq(utils.parseBytes32String(genesisTitle));
  //     expect(await duckMachine.duckTitles(0)).to.be.eq(genesisTitle);

  //     const block = await ethers.provider.getBlockNumber();
  //     const events = await duckMachine.queryFilter(duckMachine.filters.DuckTitleGranted(), block);
  //     const event = duckMachine.interface.parseLog(events[events.length - 1]);   

  //     expect(event.args.tokenId).to.be.eq(0);
  //     expect(event.args.title).to.be.eq(genesisTitle);
  //     expect(event.args.owner).to.be.eq(machineOwner.address);      
  //   });
  // });

  // describe("MOTD", () => {
  //   it("Machine owner can set MOTD", async () => {    
  //     await expect(duckMachine.setMOTD('Welcome to the duck machine!')).not.to.be.reverted;

  //     await expect(
  //       duckMachine.transferFrom(machineOwner.address, machineOwner2.address, 420)
  //     ).not.to.be.reverted;

  //     await expect(duckMachine.connect(machineOwner2).setMOTD('Critical update!')).not.to.be.reverted;

  //     const events = await duckMachine.queryFilter(duckMachine.filters.MOTDSet());
  //     const motd1 = duckMachine.interface.parseLog(events[0]);   
  //     const motd2 = duckMachine.interface.parseLog(events[1]);   
      
  //     expect(events.length).to.be.eq(2);
  //     expect(motd1.args.owner).to.be.eq(machineOwner.address);
  //     expect(motd1.args.message).to.be.eq('Welcome to the duck machine!');

  //     expect(motd2.args.owner).to.be.eq(machineOwner2.address);
  //     expect(motd2.args.message).to.be.eq('Critical update!');
  //   });

  //   it("Reverts if unauthorized user tries to set MOTD", async () => {
  //     await expect(duckMachine.setMOTD('blah')).to.be.revertedWith('Unauthorized()');
  //   });
  // });
});
