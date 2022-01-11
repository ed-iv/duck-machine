// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "sstore2/SSTORE2.sol";
import { Base64 } from "base64/base64.sol";
import "@solmate/utils/SafeTransferLib.sol";
import "./OwnableByERC721.sol";

contract TheAmazingDuckMachine is ERC721, OwnableByERC721 {
    using Strings for uint256;

    uint256 public tozziDuckPrice;
    uint256 public customDuckPrice;
    uint256 public maxCustomDucks;
    bool public tozziDucksEnabled;
    bool public customDucksEnabled;

    mapping (uint256 => address) public duckIdToWEBP;
    mapping (bytes32 => bool) public isCustomExisting;

    string private _contractURI;
    bytes32 private constant _merkleRoot = 0x0885f98e28c44d2dd7b21d5b9e2661e99e90482a771a419967dd2c9c8edfb0d7;
    uint256 private _customCounter;

    constructor(address chainsawProjects) ERC721("Tozzi Ducks", "TZDUCKS") OwnableByERC721(chainsawProjects) {}
    
    function withdraw(address recipient) public onlyOwner {
        SafeTransferLib.safeTransferETH(recipient, address(this).balance);
    }

    function setTozziDuckPrice(uint256 price) public onlyOwner {
        tozziDuckPrice = price;
    }

    function setCustomDuckPrice(uint256 price) public onlyOwner {
        customDuckPrice = price;
    }

    function setMaxCustomDucks(uint256 max) public onlyOwner {
        maxCustomDucks = max;
    }

    function flipTozziStatus() public onlyOwner {
        tozziDucksEnabled = !tozziDucksEnabled;
    }

    function flipCustomStatus() public onlyOwner {
        customDucksEnabled = !customDucksEnabled;
    }

    function mintTozziDuck(uint256 duckId, string calldata webp, bytes32[] calldata merkleProof) public payable {
        /*
        Note : don't need to check if proof has already been used because since we are minting a particular tokenId
        it will fail if it already exists
        */
        require(tozziDucksEnabled, "disabled");
        require(msg.value == tozziDuckPrice, "invalid msg.value");
        bytes32 node = keccak256(abi.encodePacked(duckId, webp));
        require(MerkleProof.verify(merkleProof, _merkleRoot, node),"invalid proof");
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[duckId] = pointer;
        _safeMint(msg.sender, duckId);
    }

    function mintCustomDuck(string calldata webp) public payable {
        require(customDucksEnabled, "disabled");
        require(_customCounter + 1 <= maxCustomDucks, "max reached");
        require(msg.value == customDuckPrice, "Invalid msg.value");
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        require(!isCustomExisting[webpHash], "already exists");
        uint256 tokenId = 200 + (_customCounter++);
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[tokenId] = pointer;
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public override view returns (string memory) {
        string memory webp = string(SSTORE2.read(duckIdToWEBP[tokenId]));
        string memory svg = string(
            abi.encodePacked(
                "<svg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' shape-rendering='crispEdges' preserveAspectRatio='xMinYMin slice'><image width='400' height='400' xlink:href='data:image/webp;base64,",
                webp,
                "'/></svg>"
            )
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', "Tozzi Duck #", tokenId.toString(), '", "description":"', "Hell yeah!", '", "image_data": "', svg,'"}')
                    )
                )
            )
        );
    }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
      return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721) {
      super._beforeTokenTransfer(from, to, tokenId);
  }
}