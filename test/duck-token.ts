import { expect } from "chai";
import { ethers } from "hardhat";
import testDuck from "../scripts/testdata/testdata";
import "hardhat-gas-reporter";

describe("Duck Token", function () {
  let accounts: any;
  let owner: any;
  
  before(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    console.log("Owner: ", owner.address, (await owner.getBalance()).toString());
  });

  it("This shows the gas usage", async function () {
    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    const nftDescriptor = await NFTDescriptor.deploy();

    await nftDescriptor.deployed();

    // Deploy TozziDuckDescriptor Contract
    const Descriptor = await ethers.getContractFactory("TozziDuckDescriptor", {
        libraries: { NFTDescriptor: nftDescriptor.address }
    });
    const descriptor = await Descriptor.deploy(testDuck.colors);
    await descriptor.deployed();

    // Deploy TozziDuckToken Contract
    const DuckToken = await ethers.getContractFactory("TozziDuckToken");
    const duckToken = await DuckToken.deploy(descriptor.address, descriptor.address);   
    await duckToken.deployed();

    // Inject duck data:    
    // await descriptor.injectDuckData(
    //     1, 
    //     [testDuck.body, testDuck.head, testDuck.bill, testDuck.hat, testDuck.decor],
    //     testDuck.background
    // );    

    // Mint and get tokenURI
    console.log('DuckToken--- ', duckToken.address, await duckToken.totalSupply());
    const foo = await duckToken.mint("0x23168EaB692E07114A7949A433408414A18eeEd7", 1);
    console.log('Minted--- ', duckToken.address, await duckToken.totalSupply());
    const tokenURI = await duckToken.tokenURI(1)
    console.log('Token URI', tokenURI);
  });
});
