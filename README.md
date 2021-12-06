# Tozzi Ducks Contracts

This project adapts the on-chain art storage strategy employed by the [nouns](https://github.com/nounsDAO/nouns-monorepo) project. SVG artwork is encoded using a [custom RLE (Run-Length Encoding)](https://nouns.notion.site/Noun-Protocol-32e4f0bf74fe433e927e2ea35e52a507#f7d579663e65480193e182355a29af63) and stored directly in on-chain storage. This data is then used to build a data URI which includes the reconstructed SVG image.

## Primary Contracts

1. `TozziDuckToken.sol` - Customized ERC-721 implementation. Most notable is the `tokenURI()` function which generates and returns a data URI. Also contains variety of administrative functions that can be used by owner of vending machine to freeze/unfreeze minting, set mint price, etc.
2. `TozziDuckDescriptor.sol` - This contract is responsible for storing encoded SVG data (duckData) and generation of data URI making use of `NFTDescriptor.sol` and `RLEToSVG.sol` libraries.
3. `ChinsawProjects.sol` - ERC-1155 contract used to create 'Project Tokens' for Chain/Saw projects. These Project Tokens are NFTs that represent particular projects that Chain/Saw is working on. These tokens can be sold to collaborators to cover up front costs and are also used in project revenue splits. Finally, certain Project Tokens have additional utility value. For example, the Project Token for this project will also represent ownership of the duck vending machine.

## Encoding Duck Data

If you want to encode some ducks or are curious where the data in the deploy.js script comes from, you can make use of the encoding scripts found in one of the `img-permutator` branches of the nouns monorepo. For example, the scripts found in this branch were used to generate duckData in the deploy script: https://github.com/nounsDAO/nouns-monorepo/tree/img-permutator-preview/src-curiosity/packages/nouns-img-permutator. 

To encode custom (non-nouns artwork), you will have to tinker around with the encode.js and decode.js scripts in the `encoding/` directory to point them to the location of your target image. Eventually, these scripts will adapted too and added to this repo, but hacking at the nouns repo is the current method.
