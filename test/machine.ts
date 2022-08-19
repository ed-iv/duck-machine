import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import duckData from "../duck-data/proofs.json";
import { MachineConfig } from "../utils/types";
import { defaultConfig, allowConfig, enabledConfig, ONE_WEEK } from "../utils/constants";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils } from "ethers";

const ducks = Object.values(duckData);

const compareConfigs = (a: MachineConfig | any, b: MachineConfig | any) => {
  expect(a.tozziDuckPrice).to.be.eq(b.tozziDuckPrice);
  expect(a.customDuckPrice).to.be.eq(b.customDuckPrice);
  expect(a.maxCustomDucks).to.be.eq(b.maxCustomDucks);
  expect(a.tozziDuckMintStatus).to.be.eq(b.tozziDuckMintStatus);
  expect(a.customDuckMintStatus).to.be.eq(b.customDuckMintStatus);  
}

const compareAllowances = (a: any, b: any) => {
  expect(a.tozziDuckAllowance).to.be.eq(b.tozziDuckAllowance);
  expect(a.customDuckAllowance).to.be.eq(b.customDuckAllowance);
}

describe("Duck Machine", () => {

  const deployDuckMachineFixture = async () => {
    const [deployer, owner, user] = await ethers.getSigners();    
    const DuckMachine = await ethers.getContractFactory("TheAmazingTozziDuckMachine");
    const duckMachine = await DuckMachine.deploy(defaultConfig, "Ownership Token URI");
    const ownershipTokenId = await duckMachine.OWNERSHIP_TOKEN_ID();
    await duckMachine.transferFrom(deployer.address, owner.address, ownershipTokenId);

    return { deployer, owner, user, duckMachine, ownershipTokenId };
  }

  describe("Machine Configuration", () => {
    it("Supports interfaces", async() => {
      const { owner, duckMachine, ownershipTokenId }  = await loadFixture(deployDuckMachineFixture);
      expect(await duckMachine.supportsInterface(0x80ac58cd)).to.be.eq(true);
      expect(await duckMachine.supportsInterface(0x5b5e139f)).to.be.eq(true);
      expect(await duckMachine.supportsInterface(0x780e9d63)).to.be.eq(true);      
    });

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
      const { user, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      // Deployer cannot update since ownership token has been transferred
      await expect(
        duckMachine.setMachineConfig(enabledConfig)
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");
      // Random user shouldn't be able to do this, obv
      await expect(
        duckMachine.connect(user).setMachineConfig(enabledConfig)
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");

      const config = await duckMachine.machineConfig();
      compareConfigs(config, defaultConfig);
    });

    it("Allows machine owner to set duck allowances", async () => {
      const { user, owner, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);
      
      let allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      
      await expect(duckMachine.connect(owner).setDuckAllowance(user.address, [2, 1]))
        .not.to.be.reverted;
      
      allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(2);
      expect(allowance.customDuckAllowance).to.be.eq(1);

      // Revoke allowance
      await expect(duckMachine.connect(owner).setDuckAllowance(user.address, [0, 0]))
        .not.to.be.reverted;
      allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
    });

    it("Allows machine owner to set duck allowances for multiple users at once", async () => {
      const { user, owner, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);
      const [, , , user1, user2, user3, user4, user5] = await ethers.getSigners();
      const testUsers = [user1, user2, user3, user4, user5];
      const zeroAllowance = { tozziDuckAllowance: 0, customDuckAllowance: 0 };
      const testAllowance = { tozziDuckAllowance: 1, customDuckAllowance: 1 };
    
      let allowance = await duckMachine.duckAllowances(user1.address);
      compareAllowances(allowance, zeroAllowance);
      allowance = await duckMachine.duckAllowances(user2.address);
      compareAllowances(allowance, zeroAllowance);
      allowance = await duckMachine.duckAllowances(user3.address);
      compareAllowances(allowance, zeroAllowance);
      allowance = await duckMachine.duckAllowances(user4.address);
      compareAllowances(allowance, zeroAllowance);
      allowance = await duckMachine.duckAllowances(user5.address);
      compareAllowances(allowance, zeroAllowance);

      await expect(duckMachine.connect(owner).setDuckAllowances(testUsers.map(u => u.address), testAllowance))
        .not.to.be.reverted;
    
      allowance = await duckMachine.duckAllowances(user1.address);
      compareAllowances(allowance, testAllowance);
      allowance = await duckMachine.duckAllowances(user2.address);
      compareAllowances(allowance, testAllowance);
      allowance = await duckMachine.duckAllowances(user3.address);
      compareAllowances(allowance, testAllowance);
      allowance = await duckMachine.duckAllowances(user4.address);
      compareAllowances(allowance, testAllowance);
      allowance = await duckMachine.duckAllowances(user5.address);
      compareAllowances(allowance, testAllowance);    
    });

    

    it("Reverts if unauthorized user tries to set duck allowances", async () => {
      const { user, duckMachine, owner }  = await loadFixture(deployDuckMachineFixture);      
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);
      await expect(
        duckMachine.connect(user).setDuckAllowance(user.address, [100, 100])
      ).to.be.revertedWithCustomError(duckMachine, "Unauthorized");
      const allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
    });

    it("Reverts max custom ducks set lower than current number of custom ducks", async () => {
      const { user, duckMachine, owner }  = await loadFixture(deployDuckMachineFixture);      
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);

      // Mint 5 custom ducks
      for (let i = 0; i < 5; i++) {
        await duckMachine.connect(user).mintCustomDuck(user.address, ducks[i].webp, { value: enabledConfig.customDuckPrice });
      }

      expect(await duckMachine.totalSupply()).to.be.eq(6);
      await expect(duckMachine.connect(owner).setMachineConfig({...enabledConfig, maxCustomDucks: 5 })) 
        .not.to.be.reverted;

      // Try to set maxCustom ducks to value < 5
      await expect(duckMachine.connect(owner).setMachineConfig({...enabledConfig, maxCustomDucks: 0 }))
        .to.be.reverted;        
    });
  });

  describe("Tozzi Duck Minting", () => {    
    it("Allows users to mint tozzi ducks", async () => {      
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);          
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);
      await Promise.all(
        ducks.map(async (duck, index) => {          
          await expect(duckMachine.connect(user).mintTozziDuck(
              user.address,
              index, 
              duck.webp, 
              duck.proof, 
              { value: enabledConfig.tozziDuckPrice }
          )).to.emit(duckMachine, "DuckMinted")
            .withArgs(
              index, 
              utils.solidityKeccak256(['string'], [duck.webp]),
              user.address,
              user.address, 
              0, 
              enabledConfig.tozziDuckPrice
            );        
        })
      );
      expect(await duckMachine.totalSupply()).to.be.eq(201);
      expect(await duckMachine.balanceOf(user.address)).to.be.eq(200);      
    });

    it("Reverts when tozzi duck minting is disabled", async () => {
      const { user, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      
      const config = await duckMachine.machineConfig();
      compareConfigs(config, defaultConfig);
      await expect(
        duckMachine.connect(user).mintTozziDuck(
          user.address,
          0, 
          duckData[0].webp, 
          duckData[0].proof, 
          { value: defaultConfig.tozziDuckPrice })
      ).to.be.revertedWithCustomError(duckMachine, "MintingDisabled");
    });

    it("Allows users with duck allowances to mint tozzi ducks", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);      
      await expect(duckMachine.connect(owner).setMachineConfig(allowConfig))
        .to.emit(duckMachine, "MachineConfigUpdated")
        .withArgs(owner.address, ...Object.values(allowConfig));
      
      await expect(duckMachine.connect(user).mintTozziDuck(
        user.address,
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: allowConfig.tozziDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "InsufficientDuckAllowance");

      await expect(duckMachine.connect(owner).setDuckAllowance(user.address, [2, 0]))
        .not.to.be.reverted;

      let allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(2);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      
      await expect(duckMachine.connect(user).mintTozziDuck(
        user.address,
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: allowConfig.tozziDuckPrice }
      )).not.to.be.reverted;

      expect(await duckMachine.ownerOf(0)).to.be.eq(user.address);
      allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(1);
      expect(allowance.customDuckAllowance).to.be.eq(0);

      await expect(duckMachine.connect(user).mintTozziDuck(
        user.address,
        1, 
        duckData[1].webp, 
        duckData[1].proof, 
        { value: allowConfig.tozziDuckPrice }
      )).not.to.be.reverted;

      expect(await duckMachine.ownerOf(1)).to.be.eq(user.address);
      allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(3);
    });
  });

  describe("Custom Duck Minting", () => {    
    it("Allows users to mint custom ducks", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);     
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);
      
      // Mint 10 custom ducks (re-uses tozzi duck image data)
      await Promise.all(
        ducks.map(async (duck, index) => {
          if (index >= 10) return;
          await expect(
            duckMachine.connect(user).mintCustomDuck(
              user.address,
              duck.webp, 
              { value: enabledConfig.customDuckPrice }
            )
          ).to.emit(duckMachine, "DuckMinted")
          .withArgs(
            200 + index, 
            utils.solidityKeccak256(['string'], [duck.webp]),
            user.address,
            user.address, 
            1, 
            enabledConfig.customDuckPrice
          );          
        })
      );

      expect(await duckMachine.balanceOf(user.address)).to.be.eq(10);
      expect(await duckMachine.totalSupply()).to.be.eq(11);
      
      for (let i = 0; i < 10; i++) {
        expect(await duckMachine.ownerOf(200 + i)).to.be.eq(user.address);
        expect(await duckMachine.duckCreators(200 + i))
          .to.be.eq(user.address);
      } 
    });

    it("Skips ownership token", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      await duckMachine.connect(owner).setMachineConfig({...enabledConfig, maxCustomDucks: 1000});

      const toMint = Array.from(Array(1000).keys());
      await Promise.all(
        toMint.map(async (duck, index) => {
          const expectedIndex = index + 200 >= 420 ? index + 201 : index + 200;
          const mockImageData = ducks[0].webp + `duck-image-${index}`;
          await expect(
            duckMachine.connect(user).mintCustomDuck(
              user.address,
              mockImageData,
              { value: enabledConfig.customDuckPrice }
            )
          ).to.emit(duckMachine, "DuckMinted")
          .withArgs(
            expectedIndex, 
            utils.solidityKeccak256(['string'], [mockImageData]),
            user.address,
            user.address, 
            1, 
            enabledConfig.customDuckPrice
          );          
        })
      );
      expect(await duckMachine.balanceOf(user.address)).to.be.eq(1000);
      expect(await duckMachine.totalSupply()).to.be.eq(1001);
    });

    it("Reverts when custom duck minting is disabled", async () => {
      const { user, duckMachine }  = await loadFixture(deployDuckMachineFixture);           
      const config = await duckMachine.machineConfig();
      compareConfigs(config, defaultConfig);

      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: defaultConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "MintingDisabled");
    });

    it("Allows users with duck allowances to mint custom ducks", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);      
      await expect(duckMachine.connect(owner).setMachineConfig(allowConfig))
        .to.emit(duckMachine, "MachineConfigUpdated")
        .withArgs(owner.address, ...Object.values(allowConfig));

      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: allowConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "InsufficientDuckAllowance");
      
      await duckMachine.connect(owner).setDuckAllowance(user.address, [0, 2]);
      let allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(2);
      
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        {value: allowConfig.customDuckPrice }
      )).to.emit(duckMachine, "DuckMinted")
        .withArgs(
          200, 
          utils.solidityKeccak256(['string'], [ducks[0].webp]),
          user.address, 
          user.address, 
          1, 
          allowConfig.customDuckPrice
        );
      expect(await duckMachine.ownerOf(200)).to.be.eq(user.address);
      
      allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(1);
      
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[1].webp,
        { value: allowConfig.customDuckPrice }
      )).to.emit(duckMachine, "DuckMinted")
      .withArgs(
        201, 
        utils.solidityKeccak256(['string'], [ducks[1].webp]),
        user.address, 
        user.address,
        1, 
        allowConfig.customDuckPrice
      );

      expect(await duckMachine.ownerOf(201)).to.be.eq(user.address);
      allowance = await duckMachine.duckAllowances(user.address);
      expect(allowance.tozziDuckAllowance).to.be.eq(0);
      expect(allowance.customDuckAllowance).to.be.eq(0);
      expect(await duckMachine.totalSupply()).to.be.eq(3);
    });

    it("Reverts on custom duck collisions", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);

      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: enabledConfig.customDuckPrice }
      )).not.to.be.reverted;

      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: enabledConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "DuckAlreadyExists");
    });

    it("Reverts when custom duck limit has been reached", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);         
      await duckMachine.connect(owner).setMachineConfig({ ...enabledConfig, maxCustomDucks: 2 });
      await duckMachine.connect(user)
        .mintCustomDuck(user.address, ducks[0].webp, { value: enabledConfig.customDuckPrice });
      await duckMachine.connect(user)
        .mintCustomDuck(user.address, ducks[1].webp, { value: enabledConfig.customDuckPrice });
      expect (await duckMachine.totalSupply()).to.be.eq(3);
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[2].webp, 
        { value: enabledConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "CustomDuckLimitReached");
    });
  });

  describe("Burning ducks", () => {    
    it("Allows owner to burn custom ducks during probation", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);   
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);  
      await duckMachine.connect(user)
        .mintCustomDuck(user.address, ducks[0].webp, { value: enabledConfig.customDuckPrice });

      expect(await duckMachine.totalSupply()).to.be.eq(2);
      expect(await duckMachine.ownerOf(200)).to.be.eq(user.address);

      await expect(duckMachine.connect(owner).burnRenegadeDuck(200, 'lol'))
        .to.emit(duckMachine, "CustomDuckBurned")
        .withArgs(200, user.address, owner.address, ducks[0].webp, 'lol');

      expect(await duckMachine.totalSupply()).to.be.eq(1);
      await expect(duckMachine.ownerOf(200)).to.be.revertedWith("ERC721: owner query for nonexistent token");
    });

    it("Reverts when burning custom ducks that are no longer on probation", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);   
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);  
      await duckMachine.connect(user)
        .mintCustomDuck(user.address, ducks[0].webp, { value: enabledConfig.customDuckPrice });
      
      expect(await duckMachine.totalSupply()).to.be.eq(2);
      expect(await duckMachine.ownerOf(200)).to.be.eq(user.address);
      
      // Advance the timestamp by 1 WEEK
      await time.increase(ONE_WEEK); 

      await expect(duckMachine.connect(owner).burnRenegadeDuck(200, 'lol'))
        .to.be.revertedWithCustomError(duckMachine, "BurnWindowPassed")
    });

    it("Allows all allotted custom ducks to be minted even if some get burned", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);   
      await duckMachine.connect(owner).setMachineConfig({...enabledConfig, maxCustomDucks: 2} );  
      
      // Mint 2 Ducks:
      await duckMachine.connect(user)
        .mintCustomDuck(user.address, ducks[0].webp, { value: enabledConfig.customDuckPrice });
      await duckMachine.connect(user)
        .mintCustomDuck(user.address, ducks[1].webp, { value: enabledConfig.customDuckPrice });

      expect(await duckMachine.totalSupply()).to.be.eq(3);
      expect(await duckMachine.ownerOf(200)).to.be.eq(user.address);
      expect(await duckMachine.ownerOf(201)).to.be.eq(user.address);

      // Cannot mint another:
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: enabledConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "CustomDuckLimitReached");  

      // Burn One:
      await expect(duckMachine.connect(owner).burnRenegadeDuck(201, 'lol'))
        .to.emit(duckMachine, "CustomDuckBurned")
        .withArgs(201, user.address, owner.address, ducks[1].webp, 'lol');

      expect(await duckMachine.totalSupply()).to.be.eq(2);

      // Cannot re-use burned duck data:
      await expect(
        duckMachine.connect(user).mintCustomDuck(user.address, ducks[1].webp, { value: enabledConfig.customDuckPrice })
      ).to.be.revertedWithCustomError(duckMachine, "DuckAlreadyExists");

      await expect (
        duckMachine.connect(user).mintCustomDuck(user.address, ducks[2].webp, { value: enabledConfig.customDuckPrice })
      ).to.emit(duckMachine, "DuckMinted")
        .withArgs(
          202, 
          utils.solidityKeccak256(['string'], [ducks[2].webp]),
          user.address,
          user.address, 
          1, 
          enabledConfig.customDuckPrice
        );

      expect(await duckMachine.totalSupply()).to.be.eq(3);
      expect(await duckMachine.ownerOf(202)).to.be.eq(user.address);

       // Back to max capacity:
       await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[3].webp, 
        { value: enabledConfig.customDuckPrice }
      )).to.be.revertedWithCustomError(duckMachine, "CustomDuckLimitReached");  
    });
  });

  describe("Accounting", () => {    
    it("Only accepts the correct price for ducks", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);   
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);  

      // (Tozzi) Below
      await expect(duckMachine.connect(user).mintTozziDuck(
        user.address,
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: utils.parseEther("0.05") }
      )).to.be.revertedWithCustomError(duckMachine, "IncorrectDuckPrice");

      // (Tozzi) Above
      await expect(duckMachine.connect(user).mintTozziDuck(
        user.address,
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: utils.parseEther("1.0") }
      )).to.be.revertedWithCustomError(duckMachine, "IncorrectDuckPrice");

      // (Custom) Below
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: utils.parseEther("0.05") }
      )).to.be.revertedWithCustomError(duckMachine, "IncorrectDuckPrice");

      // (Custom) Above
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: utils.parseEther("1.0") }
      )).to.be.revertedWithCustomError(duckMachine, "IncorrectDuckPrice"); 
    });

    it("Allows the machine owner to withdraw collected balance", async () => {
      const { owner, user, duckMachine }  = await loadFixture(deployDuckMachineFixture);   
      await duckMachine.connect(owner).setMachineConfig(enabledConfig);  

      const provider = ethers.provider;      
      expect(await provider.getBalance(duckMachine.address)).to.be.eq(0);
      // (Tozzi) Below
      await expect(duckMachine.connect(user).mintTozziDuck(
        user.address,
        0, 
        duckData[0].webp, 
        duckData[0].proof, 
        { value: enabledConfig.tozziDuckPrice }
      )).not.to.be.reverted;      
      expect(await provider.getBalance(duckMachine.address)).to.be.eq(utils.parseEther("0.1"));

      // (Custom) Below
      await expect(duckMachine.connect(user).mintCustomDuck(
        user.address,
        ducks[0].webp, 
        { value: enabledConfig.customDuckPrice }
      )).not.to.be.reverted;

      // Tozzi duck price (0.1) + custom price (0.2) = 0.3
      expect(await provider.getBalance(duckMachine.address)).to.be.eq(utils.parseEther("0.3"));

      await expect(duckMachine.connect(user).withdraw(user.address, utils.parseEther("0.3")))
        .to.be.revertedWithCustomError(duckMachine, "Unauthorized");
      
      const preBalance = await provider.getBalance(user.address);
      await expect(duckMachine.connect(owner).withdraw(user.address, utils.parseEther("0.3")))
        .not.to.be.reverted;
      const expectedBalance = preBalance.add(utils.parseEther("0.3"));
      expect(await provider.getBalance(user.address)).to.be.eq(expectedBalance);
    });
  });
});
