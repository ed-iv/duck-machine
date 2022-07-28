import fs from 'fs';
// import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { BigNumber, utils } from 'ethers';
const naturalCompare = require('string-natural-compare');

const imgPath = 'duck-data/images/webp';

export const getProof = (tree: MerkleTree, webp: string): string[] => {
  return tree.getHexProof(keccak256(Buffer.from(webp, "hex")));
}

const hash = (v: string, index: number) => {
  return keccak256(Buffer.from(`${index},${v}`, "hex"));
}

async function main() {      
  
  fs.readdir(imgPath, (err, files) => {
    if (err) {
        return console.log(err);
    } 

    const elements = files.sort(naturalCompare)
      .map((file, index) => {
        const webp = fs.readFileSync(`${imgPath}/${file}`, {encoding: 'base64'});
        return {
          webp,
          leaf: utils.solidityPack(["uint256", "string"], [BigNumber.from(index), webp])
        }        
      });          
    const tree = new MerkleTree(
      elements.map(e => e.leaf), 
      keccak256,
      { hashLeaves: true, sortPairs: true }
    );

    const proofs: any = {};    
    
    for (let i = 0; i < elements.length; i++) {      
      const proof = tree.getHexProof(keccak256(elements[i].leaf));
      console.log(proof);
      proofs[i] = { ...elements[i], proof }      
    }

    fs.writeFileSync(`./duck-data/root.txt`, tree.getHexRoot());     
    fs.writeFileSync(`./duck-data/proofs.json`, JSON.stringify(proofs));     
    
  });


  // Generate Proofs
  

  // const whitelist = {
  //   root: merkleTree.getHexRoot(),
  //   proofs: proofs 
  // }
  
  try {
    // fs.writeFileSync(`./data/owners.json`, JSON.stringify(owners));  
    // fs.writeFileSync(`./data/whitelist.json`, JSON.stringify(whitelist));  
  } catch (e) {
    console.log(e);
  }

  

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});