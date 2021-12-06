//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./ChainsawProjects.sol";
import "./OwnableByToken.sol";

/*
* Machine Guts - Boring-Ass Internals of The Amazing Duck Machine
*/

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract TheAmazingDuckMachine is ERC721, ERC721Enumerable, OwnableByToken {  
    
    struct DuckMintingStatus {
        bool tozziDuckEnabled;
        bool customDuckEnabled;
    }

    enum DuckType {
        Tozzi,
        Custom
    }

    string public _contractURI;  
    address public immutable proxyRegistryAddress;
    
    // Custom State Variables
    DuckMintingStatus public duckMintingStatus = DuckMintingStatus(false, false);
    uint8 public maxTozziDucks = 200;  
    uint8 public maxCustomDucks = 0;
    bool public tozziDuckMintStatus = false;
    bool public canMintCustomDucks = false;

    // * Events *
    event DuckMintingStatusChanged(
        address indexed sender, 
        bool tozziDuckEnabled,
        bool customDuckEnabled
    );

    // * Functions (public) *
    constructor(
        address ownershipTokenContract, 
        uint256 ownershipTokenId,
        address _proxyRegistryAddress    
    ) 
        ERC721("Tozzi Ducks", "TZDUCK") 
        OwnableByToken(ownershipTokenId, ownershipTokenContract)
    {   
        proxyRegistryAddress = _proxyRegistryAddress;    
    }
        
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {

        return "duck SVG";
    }

    // mintTozziDuck

    // mintCustomDuck



    // * Functions (Admin) *
    function setMintingStatus(
        bool _tozziDuckEnabled, 
        bool _customDuckEnabled
    ) 
        public 
        onlyOwner 
    {
        canMintTozziDucks = enabled;
    }

    function setCanMintCustomDucks(bool enabled) public onlyOwner{
        canMintCustomDucks = enabled;
    }

    // toggle minting
    
    // adjust mint price

    // adjust mint total issuance
  



    










  ///////////////////////////////////////////////////////////////////////////////////////
  // BORING 
  ///////////////////////////////////////////////////////////////////////////////////////
 

  /**
    * @dev See {IERC165-supportsInterface}.
  */
  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721, ERC721Enumerable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }
  
  function _burn(uint256 tokenId) internal override(ERC721) {
    super._burn(tokenId);
  }


  /**
   * @dev Override for OpenSea proxy accounts
   */
  function isApprovedForAll(address owner, address operator) 
    public 
    view 
    override 
    returns (bool) 
  { 
    ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    if (address(proxyRegistry.proxies(owner)) == operator) {
      return true;
    }

    return super.isApprovedForAll(owner, operator);
  }

  /**
  * @dev OpenSea specific contract metadata
  */
  function contractURI() 
    public 
    view 
    returns (string memory) 
  {
    return _contractURI;
  }

  function setContractURI(string memory newContractURI)
    public
    onlyOwner
  {
    _contractURI = newContractURI;
  }

  function _baseURI() 
    internal 
    view 
    virtual 
    override 
    returns (string memory) 
  {
    return "ipfs://";
  }
}