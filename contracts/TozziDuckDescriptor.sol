// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

import { RLEToSVG } from "./libs/RLEToSVG.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { NFTDescriptor } from "./libs/NFTDescriptor.sol";

// TODO - Credit Nouns in accordance w/ GPL-3.0
// TODO - Access control
contract TozziDuckDescriptor {
    using Strings for uint256;
              
    mapping(uint8 => string[]) public palettes;

    // Backgrounds (Hex Colors)
    string[200] public backgrounds;

    // Bodies (Nouns RLE)
    bytes[200] public bodies;

    // Noun Heads (Nouns RLE)
    bytes[200] public heads;

    // Noun Heads (Nouns RLE)
    bytes[200] public bills;

    // Noun Accessories (Custom RLE)
    bytes[200] public hats;

    // Noun Glasses (Custom RLE)
    bytes[200] public decors;

    constructor(string[] memory _colors) {
        palettes[0] = _colors;
    }

    /**
      * @notice Given a token ID construct a token URI for an official Nouns DAO noun.
      * @dev The returned value will be a base64 encoded data URI.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory) {        
        return dataURI(tokenId);
    }

    /**
      * @notice Given a token ID and construct a base64 encoded data URI for an official Nouns DAO noun.
    */
    // TODO - Finalize name and description
    function dataURI(uint256 tokenId) public view returns (string memory) {
        string memory duckId = tokenId.toString();
        string memory name = string(abi.encodePacked("Tozzi Duck ", duckId));
        string memory description = string(abi.encodePacked("Tozzi Duck ", duckId, " is a very fine duck."));

        return genericDataURI(tokenId, name, description);
    }

    /**
     * @notice Given a name and description, construct a base64 encoded data URI.
     */
    function genericDataURI(
        uint256 tokenId,
        string memory name,
        string memory description       
    ) public view returns (string memory) {
        NFTDescriptor.TokenURIParams memory params = NFTDescriptor.TokenURIParams({
            name: name,
            description: description,
            parts: _getPartsFromTokenId(tokenId),
            background: backgrounds[tokenId]
        });
        return NFTDescriptor.constructTokenURI(params, palettes);
    }

     /**
     * @notice Get all Noun parts for the passed `seed`.
     */
    function _getPartsFromTokenId(uint tokenId) internal view returns (bytes[] memory) {
        bytes[] memory _parts = new bytes[](5);
        _parts[0] = bodies[tokenId];
        _parts[1] = heads[tokenId];
        _parts[2] = bills[tokenId];
        _parts[3] = hats[tokenId];
        _parts[4] = decors[tokenId];
        return _parts;
    }

    function injectDuckData(
        uint tokenId, 
        bytes[5] calldata _parts, 
        string calldata _background
    ) public {
        backgrounds[tokenId] = _background;
        bodies[tokenId] = _parts[0];
        heads[tokenId] = _parts[1];
        bills[tokenId] = _parts[2];
        hats[tokenId] = _parts[3];
        decors[tokenId] = _parts[4];
    }

    /**
     * @notice Add a background.
     */
    function _addBackground(uint tokenId, string calldata _background) public {
        backgrounds[tokenId] = _background;
    }

    /**
     * @notice Add a body.
     */
    function _addBody(uint tokenId, bytes calldata _body) public {        
        bodies[tokenId] = _body;
    }

    /**
     * @notice Add a head.
     */
    function _addHead(uint tokenId, bytes calldata _head) public {
        heads[tokenId] = _head;
    }

    /**
     * @notice Add a head.
     */
    function _addBill(uint tokenId, bytes calldata _bill) public {
        bills[tokenId] = _bill;
    }

    /**
     * @notice Add a decor.
     */
    function _addDecor(uint tokenId, bytes calldata _decor) public {
        decors[tokenId] = _decor;
    }
}
