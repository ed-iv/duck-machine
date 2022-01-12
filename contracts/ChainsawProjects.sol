// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
import "./interfaces/IOwnableByERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChainsawProjects is ERC721 {
    
    uint256 private _counter;

    struct Project {      
      string name;
      address NFT;
    }
    
    mapping(uint256 => Project) public registry;

    constructor() ERC721("Chainsaw Projects", "CSP") {}

    function addProject(string calldata name, address nft) public {
        registry[_counter] = Project(name, nft);
        IOwnableByERC721(nft).setProjectId(_counter);
        _safeMint(msg.sender, _counter);
        _counter++;
    }

}