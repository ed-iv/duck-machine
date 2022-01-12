# Tozzi Ducks Contracts

This project emulates a vending machine that dispenses NFTs featuring pixel-art ducks made by artist Jim Tozzi. There are 200 Tozzi ducks that will be minted by users at a price set by the admin of the contract. Additionally, users will also have the option to mint their own custom ducks that they draw using a drawing app embedded in the front-end of this application.

## On-Chain Image Data

All image data for both Tozzi and Custom ducks is going to be stored entirely on-chain taking advantage of (1) the .webp image compression format and (2) storing image data as bytecode using the [`SSTORE2` library from Rari-Capital](https://github.com/Rari-Capital/solmate/blob/main/src/utils/SSTORE2.sol) to save on storage costs. Additionally, minting costs will be passed off to users through lazy-minting. A merkle root representing the hashed data of all 200 valid Tozzi duck images is stored as a constant and used to verify duck data which will be submitted by users from the front-end as part of the minting process.

## Tokenization of Machine Ownership

Additionally, the vending machine itself will be tokenized such that ownership of the machine will be transferrable as an ERC-721 token. The holder of this token will have access to a suite of administrative features, e.g. pausing duck minting, modifying minting prices, etc.

As a rudimentary content management system, the owner of the machine will also be able to burn any custom ducks within a specified window of 1 week. This gives the owner of the machine some control over what content makes its way into the collection.

## Contracts

There are three primary contracts in play here:

1. `ChainsawProjects.sol` - This contract will be used for this and future Chain/Saw projects to create 'Project Tokens' that will be minted to represent specific projects. In some cases, these tokens will afford the owner utility. In this case, the holder of the TozziDuck project token will be the administrator of the machine.
2. `OwnableByERC721.sol` - Overrides ERC-721 `owner()` function so that it returns the address of  the owner of a specified ownership token (ERC-721)
3. `TheAmazingTozziDuckMachine.sol` - The primary contract representing the duck machine. Has all necessary functionality for minting and administrating the state of the machine.
