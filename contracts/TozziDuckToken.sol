// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./TozziDuckDescriptor.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

// TODO - Credit Nouns in accordance w/ GPL-3.0
// TODO - Access control
contract TozziDuckToken is ERC721Enumerable {
    using Counters for Counters.Counter;

    TozziDuckDescriptor public immutable descriptor;    
    address public immutable proxyRegistryAddress;
    
    constructor(
        TozziDuckDescriptor _descriptor,
        address _proxyRegistryAddress
    ) ERC721("TozziDuck", "TZDUCK") {
        descriptor = _descriptor;
        proxyRegistryAddress = _proxyRegistryAddress;
    }

    /**
     * @notice The IPFS URI of contract-level metadata.
     */
    function contractURI() public view returns (string memory) {
        // TODO
    }

    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator)
        override
        public
        view
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {        
        require(_exists(tokenId), "TozziDuckToken: URI query for nonexistent token");
        return descriptor.dataURI(tokenId);
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "TozziDuckToken: URI query for nonexistent token");
        return descriptor.dataURI(tokenId);
    }

    function mint(address _to, uint256 tokenId) public {
        // bytes memory duckData = descriptor.duckData(tokenId);        
        // require(duckData.length > 0, "Cannot mint that duck, no data exists");
        _mint(_to, tokenId);
    }
}
