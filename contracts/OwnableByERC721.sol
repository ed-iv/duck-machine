// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "./interfaces/IOwnableByERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";

interface SIERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

abstract contract OwnableByERC721 is IOwnableByERC721, Context {

    uint256 private _projectId;
    SIERC721 private _chainsawProjects;

    constructor(address chainsawProjects) {
        _chainsawProjects = SIERC721(chainsawProjects);
    }

    function setProjectId(uint256 projectId) public override {
        require(msg.sender == address(_chainsawProjects));
        _projectId = projectId;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _chainsawProjects.ownerOf(_projectId);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
}
