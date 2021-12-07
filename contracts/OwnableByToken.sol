// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProjectTokenManager.sol";

/**
 * @dev provides access control based on posession of OwnershipToken
 */
abstract contract OwnableByToken is Ownable {
    struct OwnershipToken {
        uint256 tokenId;
        address tokenContract;                
    }    
    
    OwnershipToken public ownershipToken;
    
    /**
     * @dev Initializes the contract, setting owner to designated ownership token
     */
    constructor(OwnershipToken memory _ownershipToken) {
        // TODO - assert valid ownershipToken        
        ownershipToken = _ownershipToken;
    }

    /**
     * @dev Throws if message not sent from ownership token contract.
     */
    modifier onlyOwnershipTokenContract() {
        require(
            msg.sender == ownershipToken.tokenContract, 
            "OwnableByToken: call must issue from ownership token contract."
        );
        _;
    }

    /**
     * @dev Called remotely by ProjectTokenManager on transfer of corresponding 
     * OwnershipToken to record new owner (holder of OwnershipToken)
     */
    function handleOwnershipTokenTransfer(address newOwner) 
        public 
        virtual 
        onlyOwnershipTokenContract
    {        
        _transferOwnership(newOwner);
    }
}