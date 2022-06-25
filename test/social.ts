import { expect } from "chai";
import { ethers } from "hardhat";
import { base64 } from "ethers/lib/utils";
import { TheAmazingTozziDuckMachine } from "../typechain";
import "hardhat-gas-reporter";
import duckData from "../duck-data/proofs.json";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { enabledConfig } from '../utils/constants';
import { mintTozziDuck, mintCustomDuck, parseMetadata } from '../utils/helpers';
import { utils } from "ethers";

let machineOwner: SignerWithAddress,
  user1: SignerWithAddress,
  machineOwner2: SignerWithAddress,
  duckMachine: TheAmazingTozziDuckMachine;

describe("Social Mechanics", () => {
  before(async () => {
    [machineOwner, user1, machineOwner2] = await ethers.getSigners();
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    duckMachine = await DuckMachine.deploy(enabledConfig, "");
    await duckMachine.deployed();
    await mintTozziDuck(0, duckMachine);
    await mintCustomDuck(duckData[1].webp, duckMachine, user1);
  });

  // describe("Defining and Updating Duck Statuses", () => {
  //   it("Machine owner can define and update new duck status", async () => {            
  //     expect(await duckMachine.duckStatusOptions(1)).to.be.eq('');
  //     await expect(duckMachine.defineDuckStatus(1, 'chillin')).to.be.not.reverted;
  //     expect(await duckMachine.duckStatusOptions(1)).to.be.eq('chillin');

  //     // Can clear / delete status too
  //     await expect(duckMachine.defineDuckStatus(1, '')).to.be.not.reverted;
  //     expect(await duckMachine.duckStatusOptions(1)).to.be.eq('');

  //     await expect(duckMachine.defineDuckStatus(1, 'foo')).to.be.not.reverted;
  //     expect(await duckMachine.duckStatusOptions(1)).to.be.eq('foo');

  //     // Verify event(s)
  //     const events = await duckMachine.queryFilter(duckMachine.filters.DuckStatusDefined());
  //     expect(events.length).to.be.eq(3);
  //     const event = duckMachine.interface.parseLog(events[events.length - 1]);      
  //     expect(event.args.statusId).to.be.eq(1);
  //     expect(event.args.statusName).to.be.eq('foo');      
  //   });

  //   it("Reverts if machine owner tries to override status with id 0", async () => {            
  //     expect(await duckMachine.duckStatusOptions(0)).to.be.eq('');
  //     await expect(duckMachine.defineDuckStatus(0, 'chillin')).to.be.revertedWith('InvalidStatusId()');
  //   });

  //   it("Reverts if unauthorized user tries to set duck status", async () => {                  
  //     await expect(duckMachine.connect(user1).defineDuckStatus(0, 'chillin')).to.be.revertedWith('Unauthorized()');
  //   });
    
  // });

  // describe("Setting Duck Status", () => {
  //   it("Tozzi Duck owner can set valid duck status", async () => {            
  //     expect(await duckMachine.ownerOf(0)).to.be.eq(machineOwner.address);      
  //     expect(await duckMachine.duckStatuses(0)).to.be.eq(0);
  //     expect(await duckMachine.getDuckStatus(0)).to.be.eq('');

  //     await expect(duckMachine.setDuckStatus(0, 1)).to.be.not.reverted;
  //     expect(await duckMachine.duckStatuses(0)).to.be.eq(1);
  //     expect(await duckMachine.getDuckStatus(0)).to.be.eq('foo');

  //     // Verify Event
  //     const block = await ethers.provider.getBlockNumber();
  //     const events = await duckMachine.queryFilter(duckMachine.filters.DuckStatusUpdated(), block);
  //     const event = duckMachine.interface.parseLog(events[events.length - 1]);      
    
  //     expect(event.args.duckId).to.be.eq(0);
  //     expect(event.args.statusId).to.be.eq(1);
  //     expect(event.args.statusName).to.be.eq('foo');
  //     expect(event.args.who).to.be.eq(machineOwner.address);
  //   });

  //   it("Custom Duck owner can set valid duck status", async () => {            
  //     expect(await duckMachine.ownerOf(200)).to.be.eq(user1.address);      
  //     expect(await duckMachine.duckStatuses(200)).to.be.eq(0);
  //     expect(await duckMachine.getDuckStatus(200)).to.be.eq('');

  //     await expect(duckMachine.connect(user1).setDuckStatus(200, 1)).to.be.not.reverted;
  //     expect(await duckMachine.duckStatuses(200)).to.be.eq(1);
  //     expect(await duckMachine.getDuckStatus(200)).to.be.eq('foo');

  //     // Verify Event
  //     const block = await ethers.provider.getBlockNumber();
  //     const events = await duckMachine.queryFilter(duckMachine.filters.DuckStatusUpdated(), block);
  //     const event = duckMachine.interface.parseLog(events[events.length - 1]);      
    
  //     expect(event.args.duckId).to.be.eq(200);
  //     expect(event.args.statusId).to.be.eq(1);
  //     expect(event.args.statusName).to.be.eq('foo');
  //     expect(event.args.who).to.be.eq(user1.address);
  //   });

  //   it("Reverts if user tries to set invalid duck status", async () => {            
  //     await expect(duckMachine.setDuckStatus(0, 100)).to.be.revertedWith('InvalidStatusId()');
  //   });

  //   it("Reverts if unauthorized user tries to update duck status", async () => {            
  //     await expect(duckMachine.connect(user1).setDuckStatus(0, 1)).to.be.revertedWith('Unauthorized()');
  //     // Machine owner cannot set other user's duck status either
  //     await expect(duckMachine.connect(machineOwner).setDuckStatus(200, 1)).to.be.revertedWith('Unauthorized()');
  //   });

  //   it("Reverts when setting status on duck that hasn't been minted", async () => {            
  //     await expect(duckMachine.setDuckStatus(2, 1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
  //   });
  // });

  const emptyBytes32 = utils.formatBytes32String('') 
  const testName = utils.formatBytes32String('Duck Name');
  const testStatus = utils.formatBytes32String('Chillin');
  const newName = utils.formatBytes32String('Quacker');
  const newStatus = utils.formatBytes32String('Quackin');
  const genesisTitle = utils.formatBytes32String('Genesis Duck');
  describe("Setting duck profiles", () => {
    it("Machine owner can set profile of minted duck", async () => {    
      let profile = await duckMachine.duckProfiles(0);
      expect(profile.name).to.be.eq(emptyBytes32);
      expect(profile.status).to.be.eq(emptyBytes32);
      expect(profile.description).to.be.eq("");

      await expect(duckMachine.setDuckProfile(0, testName, testStatus, 'duck profile')).not.to.be.reverted;
      profile = await duckMachine.duckProfiles(0);
      expect(utils.parseBytes32String(profile.name)).to.be.eq('Duck Name');
      expect(utils.parseBytes32String(profile.status)).to.be.eq('Chillin');
      expect(profile.description).to.be.eq('duck profile');

      const block = await ethers.provider.getBlockNumber();
      const events = await duckMachine.queryFilter(duckMachine.filters.DuckProfileUpdated(), block);
      const event = duckMachine.interface.parseLog(events[events.length - 1]);   
      
      expect(event.args.duckId).to.be.eq(0);
      expect(event.args.name).to.be.eq(testName);
      expect(event.args.status).to.be.eq(testStatus);
      expect(event.args.description).to.be.eq('duck profile');      
    });
    

    it("Machine owner can set profile of duck prior to mint", async () => {    
      let profile = await duckMachine.duckProfiles(1);
      expect(profile.name).to.be.eq(emptyBytes32);
      expect(profile.status).to.be.eq(emptyBytes32);
      expect(profile.description).to.be.eq("");

      await expect(duckMachine.tokenURI(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
      await expect(duckMachine.setDuckProfile(1, testName, testStatus, 'this duck hasn\t been minted')).not.to.be.reverted;
      profile = await duckMachine.duckProfiles(1);
      expect(utils.parseBytes32String(profile.name)).to.be.eq('Duck Name');
      expect(utils.parseBytes32String(profile.status)).to.be.eq('Chillin');
      expect(profile.description).to.be.eq('this duck hasn\t been minted');

      const block = await ethers.provider.getBlockNumber();
      const events = await duckMachine.queryFilter(duckMachine.filters.DuckProfileUpdated(), block);
      const event = duckMachine.interface.parseLog(events[events.length - 1]);   
      
      expect(event.args.duckId).to.be.eq(1);
      expect(event.args.name).to.be.eq(testName);
      expect(event.args.status).to.be.eq(testStatus);
      expect(event.args.description).to.be.eq('this duck hasn\t been minted');  
      
      await mintTozziDuck(1, duckMachine);
      await expect(duckMachine.tokenURI(1)).not.to.be.reverted;
      profile = await duckMachine.duckProfiles(1);
      expect(utils.parseBytes32String(profile.name)).to.be.eq('Duck Name');
      expect(utils.parseBytes32String(profile.status)).to.be.eq('Chillin');
      expect(profile.description).to.be.eq('this duck hasn\t been minted');
    });

    it("Reverts if unauthorized user tries to set profile", async () => {    
      // Only machine owner can set profiles. User cannot update their own duck
      await expect(
        duckMachine.connect(user1).setDuckProfile(200, newName, newStatus, 'this is my duck')
      ).to.be.revertedWith('Unauthorized()');
    });

    it("Duck profile determines tokenURI", async () => {      
      let metadata = parseMetadata(await duckMachine.tokenURI(0));
      let status = metadata.attributes.find((a: any) => a.trait_type === 'Status');
      expect(metadata.name).to.be.eq('Tozzi Duck 0 - Duck Name');
      expect(status.value).to.be.eq('Chillin');
      expect(metadata.description).to.be.eq('duck profile');

      await duckMachine.setDuckProfile(0, newName, newStatus, 'updated profile');

      metadata = parseMetadata(await duckMachine.tokenURI(0));
      status = metadata.attributes.find((a: any) => a.trait_type === 'Status');
      expect(metadata.name).to.be.eq('Tozzi Duck 0 - Quacker');
      expect(status.value).to.be.eq('Quackin');
      expect(metadata.description).to.be.eq('updated profile');

      metadata = parseMetadata(await duckMachine.tokenURI(200));
      status = metadata.attributes.find((a: any) => a.trait_type === 'Status');
      expect(status.value).to.be.eq('Probation');
    });
  });

  describe("Duck Titles", () => {
    it("Allows machine owner to set title for existing duck", async () => {
      let metadata = parseMetadata(await duckMachine.tokenURI(0));
      let title = metadata.attributes.find((a: any) => a.trait_type === 'Title');
      expect(title).to.be.eq(undefined);
      expect(await duckMachine.duckTitles(0)).to.be.eq(emptyBytes32);      
      
      await expect(duckMachine.setDuckTitle(0, genesisTitle)).not.to.be.reverted;
      metadata = parseMetadata(await duckMachine.tokenURI(0));
      console.log(metadata);
      title = metadata.attributes.find((a: any) => a.trait_type === 'Title');
      expect(title.value).to.be.eq(utils.parseBytes32String(genesisTitle));
      expect(await duckMachine.duckTitles(0)).to.be.eq(genesisTitle);

      const block = await ethers.provider.getBlockNumber();
      const events = await duckMachine.queryFilter(duckMachine.filters.DuckTitleGranted(), block);
      const event = duckMachine.interface.parseLog(events[events.length - 1]);   

      expect(event.args.tokenId).to.be.eq(0);
      expect(event.args.title).to.be.eq(genesisTitle);
      expect(event.args.owner).to.be.eq(machineOwner.address);      
    });
  });

  describe("MOTD", () => {
    it("Machine owner can set MOTD", async () => {    
      await expect(duckMachine.setMOTD('Welcome to the duck machine!')).not.to.be.reverted;

      await expect(
        duckMachine.transferFrom(machineOwner.address, machineOwner2.address, 420)
      ).not.to.be.reverted;

      await expect(duckMachine.connect(machineOwner2).setMOTD('Critical update!')).not.to.be.reverted;

      const events = await duckMachine.queryFilter(duckMachine.filters.MOTDSet());
      const motd1 = duckMachine.interface.parseLog(events[0]);   
      const motd2 = duckMachine.interface.parseLog(events[1]);   
      
      expect(events.length).to.be.eq(2);
      expect(motd1.args.owner).to.be.eq(machineOwner.address);
      expect(motd1.args.message).to.be.eq('Welcome to the duck machine!');

      expect(motd2.args.owner).to.be.eq(machineOwner2.address);
      expect(motd2.args.message).to.be.eq('Critical update!');
    });

    it("Reverts if unauthorized user tries to set MOTD", async () => {
      await expect(duckMachine.setMOTD('blah')).to.be.revertedWith('Unauthorized()');
    });
  });
});
