// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// TODO - Access controls

// Type declarations, State variables, Events, Functions

contract ChainsawProjects is ERC1155 {    
    
    struct Project {      
      string name;
      address[] ownedNFTs;
    }
    
    mapping(uint256 => Project) public projectRegistry;

    constructor(string[] memory projectNames) ERC1155("") {
        uint8 currProjectId = 0;
        for (uint8 i = 0; i < projectNames.length; i++) {
            _mint(msg.sender, currProjectId, 1, "");
            Project memory newProject;            
            newProject.name = projectNames[i];
            projectRegistry[currProjectId] = newProject;
            currProjectId++;
        }
    }
    
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {        
        for (uint8 i = 0; i < ids.length; i++) {
            Project storage project = projectRegistry[ids[i]];
        }
    }


    // TODO - Override transfer function to check project registry for 
    // any NFT contracts that use this token to represent ownership. 
    // Necessary calls should be made to these contracts to emit event marking
    // transfer of ownership.
}