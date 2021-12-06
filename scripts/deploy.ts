import { ethers } from "hardhat";
import testDuck from "./testdata/testdata";

const hodler = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

async function main() {  
    // Deploy NFTDescriptor Library
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

    // Inject duck data:    
    await descriptor.injectDuckData(
        1, 
        [testDuck.body, testDuck.head, testDuck.bill, testDuck.hat, testDuck.decor],
        testDuck.background
    );    

    // Mint and get tokenURI
    console.log('well', duckToken.address, await duckToken.totalSupply());
    const foo = await duckToken.mint("0x23168EaB692E07114A7949A433408414A18eeEd7", 1);         
    console.log('hmm', duckToken.address, await duckToken.totalSupply(), foo);
    // const tokenURI = await duckToken.tokenURI(1)
    // console.log('Here is the URI', tokenURI);
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
