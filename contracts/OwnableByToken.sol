// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (access/Ownable.sol)

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "./ChainsawProjects.sol";

/**
 * @dev provides access control based on posession of OwnershipToken
 */
abstract contract OwnableByToken is Context {
    OwnershipToken public ownershipToken;
    address private holder;

    struct OwnershipToken {
        uint256 id;
        address tokenContract;                
    }    

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract, setting owner to designated ownership token
     */
    constructor(uint256 _id, address _tokenContract) {
        // TODO - require implments appropriate interface for ownership token
        // and that it exists        
        holder = _msgSender();
        ownershipToken = OwnershipToken(_id, _tokenContract);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {        
        return holder;        
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "OwnableByToken: caller is not the owner");
        _;
    }

    /**
     * @dev Records transfer of ownership token by updating ownershipToken.holder
     */
    function handleOwnershipTokenTransfer(address newHolder) public virtual {
        require(
            msg.sender != ownershipToken.tokenContract, 
            "OwnableByToken: only authorized ownership contract can initiate transfer"
        );
        _transferOwnership(newHolder);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newHolder) internal virtual {
        address oldHolder = holder;
        holder = newHolder;
        emit OwnershipTransferred(oldHolder, newHolder);
    }    
}