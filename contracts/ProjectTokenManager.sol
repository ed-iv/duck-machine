// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract ProjectTokenManager is ERC1155PresetMinterPauser {    
    
    mapping(uint256 => address) public ownedContracts;
     
    constructor() ERC1155PresetMinterPauser("") {}
    
    // TODO - Override mint function to disable it 

    // TODO - Create createNewProjectToken function to replace mint
    
    // TODO - Transfer function needs to make calls to any contracts 
    // belonging to this tokenId in 'ownedContracts' to update owner 

    // function _beforeTokenTransfer(
    //     address operator,
    //     address from,
    //     address to,
    //     uint256[] memory ids,
    //     uint256[] memory amounts,
    //     bytes memory data
    // ) internal override {}
}