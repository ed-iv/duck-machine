// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/**
 *                     ;@######@b,,,,,,      ,,,,
 *                  .;##b      8@      #N,,{@#### N,
 *                ,###b                8@          #Q;;;;;;;;,
 *              ;###b                              88#########Qssp
 *             !@#b            j@###############N            88##@@p
 *             !@#b        ;@################### #N              ?8@@Q
 *             "@@###N  @@ ###################### #N              ?8@@Q
 *               '7@#    ##b''''''''''''''''''7@### #N              @@ b
 *                  ^^3 ###@#        @#######   "@#####S            @@ b
 *                  .@#^                    '@#   '@###Q,,,,      .,@##b
 *                  !@    ,####,    ,######,        '@### #Qpppppp@@#b
 *                  '@#p;##   '@#  @@b    '@#        @ # b'@#### ### b
 *                    '@#~    '@   @ ~   ,s@           7bN,     '@###Q,
 *                   ;@@ ~   ,s@   @ ~ ,s@##             @ b     8@####Qp
 *                 ;## # ~  '@##   @ ~'@####   ;sssssso  @ b       %@@# b
 *                !@#b'8@@Q '@#####  ~'@########888888@@#  b         ""
 *               @########### ####@@ ~ '8 ####T^j@###N^7@@ b
 *             @##""""""""""""""@@### ######"^  '"""@@#N'"@@#p
 *          .@##^ ;########Q,,,,,j""""""""^       ;###@@#N@  b
 *          '@ Q@##b^jQQQQ@#      #Q,,,,,,,,,,,,@@#b^  jQ,@@#b
 *            "@#QQp@### # Q@ ##Q$@#           ### b ,@####b
 *              '@###b  '@  #Q@###QSG9^     .$@ #b.s###b
 *                           '@#Q## #N      l@@## Q##b`
 *                            '@#b@  Q  .l@@###@##b
 *                              %8@##@@######@@##b
 *                               "@@##8888@@## b
 *                                  ""^!@#  '%@ b
 *                                    @#b     @###p
 *                                ,@###       j@# #p
 *                              .@##99@##    @##99@##p
 *                              ;@ #GG$$@#######QpG8@##Q,,,,
 *                            .{@ #GGGG@# #Qp9Q@ ##GG9Q######WN,,,
 *                         ,s#888@QQGG@@##Wb788@QQ@@@ #      7@# Q,
 *           ________               _____    ________             ______
 *           ___  __/__________________(_)   ___  __ \___  __________  /_________
 *            __  /  _  __ \__  /__  /_  /    __  / / /  / / /  ___/_  //_/_  ___/
 *           _  /   / /_/ /_  /__  /_  /     _  /_/ // /_/ // /__ _  ,<  _(__  )
 *            /_/    \____/_____/____/_/      /_____/ \__,_/ \___/ /_/|_| /____/
 *
 */

import "./interfaces/ITheAmazingTozziDuckMachine.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@rari-capital/solmate/src/utils/SSTORE2.sol";
import "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {Base64} from "./lib/base64.sol";
import "hardhat/console.sol";

contract TheAmazingTozziDuckMachine is ITheAmazingTozziDuckMachine, ERC721Enumerable, Ownable {
    using Strings for uint256;    
    
    uint256 private constant TOZZI_DUCKS = 200;    
    uint256 public constant OWNERSHIP_TOKEN_ID = 420;
    // uint256 public constant probationPeriod = 1 weeks;   
    uint256 public constant probationPeriod = 10 minutes; // TODO - remove test value
    bytes32 private constant MERKLE_ROOT = 0x338d93cb1a832788e65adb648a180ffdba1e28be01ffac312541994ce443ade7;    
    uint256 private _nextCustomDuckTokenId;
    uint256 private _numCustomDucks;
    string private _ownershipTokenURI; 
    
    MachineConfig public machineConfig;
    mapping(uint256 => address) public duckCreators;
    mapping(uint256 => bytes32) public artists;
    mapping(uint256 => bytes32) public duckTitles;
    mapping(address => DuckAllowance) public duckAllowances;
    mapping(uint256 => DuckProfile) public duckProfiles;
    mapping(uint256 => address) public duckImageData;
    mapping(bytes32 => bool) public duckExists;
    mapping(uint256 => uint256) public customDuckHatchedTimes;
    
    modifier onlyMachineOwner() {
        if (_machineOwner() != _msgSender()) revert Unauthorized();
        _;
    }

    modifier onlyExtantDuck(uint256 tokenId) {
        require(_exists(tokenId), "ERC721: owner query for nonexistent token");
        _;
    }

    constructor(
        MachineConfig memory _machineConfig, 
        string memory ownershipTokenURI
    ) ERC721("Tozzi Ducks", "TZDUCKS") {
        machineConfig = _machineConfig;
        _ownershipTokenURI = ownershipTokenURI;
        _safeMint(_msgSender(), OWNERSHIP_TOKEN_ID);
    }

    /**
     * @notice Configure the machine to manage the growth of the duck population responsibly.
     */
    function setMachineConfig(MachineConfig calldata _machineConfig) external override onlyMachineOwner {
        machineConfig = _machineConfig;
        emit MachineConfigUpdated(
            _machineOwner(),
            _machineConfig.tozziDuckPrice,
            _machineConfig.customDuckPrice,
            _machineConfig.maxCustomDucks,
            _machineConfig.tozziDuckMintStatus,
            _machineConfig.customDuckMintStatus
        );
    }

    /**
     * @notice Adjust the media associated with the token representing ownership of the machine.
     */
    function setOwnershipTokenURI(
        string calldata ownershipTokenUri
    ) external override onlyMachineOwner {
        _ownershipTokenURI = ownershipTokenUri;
    }

    /**
     * @notice Share the latest news with the flock.
     * @dev Emits an event to be picked up and displayed by front-ends.
     */
    function setMOTD(string calldata motd) external override onlyMachineOwner {
        emit MOTDSet(_msgSender(), motd);
    }

    /**
     * @notice Manage the duck allowance for an individual account. A duck allowance specifies how many of each type of duck
     * (Tozzi and Custom) a given user is able to mint. A user's duck allowances will deplete with each mint. Note: Duck allowances 
     * are only taken into account when mint status for a particular duck type is set to MintStatus.Allow.
     */
    function setDuckAllowance(
        address who,
        uint128 tozziDuckAllowance,
        uint128 customDuckAllowance
    ) external override onlyMachineOwner {
        if (tozziDuckAllowance < 0 || customDuckAllowance < 0)
            revert InsufficientDuckAllowance();
        duckAllowances[who] = DuckAllowance(
            tozziDuckAllowance,
            customDuckAllowance
        );
    }
    
    /**
     * @notice Grant a special title to a deserving duck.
     */
    function setDuckTitle(
        uint256 tokenId, 
        bytes32 title
    ) external override onlyExtantDuck(tokenId) onlyMachineOwner {
        duckTitles[tokenId] = title;
        emit DuckTitleGranted(tokenId, title, _machineOwner());
    }

    /**
     * @notice Update your duck's profile by providing a custom name, status, and description.
     * @dev Customized duck profiles are used within tokenURI() when constructing a duck's metadata.
     */
    function setDuckProfile(
        uint256 tokenId,
        bytes32 name,
        bytes32 status,
        string calldata description
    ) onlyExtantDuck(tokenId) external override {
        if (ownerOf(tokenId) != _msgSender()) revert Unauthorized();
        duckProfiles[tokenId] = DuckProfile(name, status, description);
        emit DuckProfileUpdated(tokenId, name, status, description);
    }
    
    /**
     * @notice Burn a freshly minted custom duck because you hate it's face. Custom ducks that are less than
     * 1 WEEK old are subject to the destructive whims of the machine's owner.
     */
    function burnRenegadeDuck(
        uint256 tokenId, 
        string calldata reason
    ) external override onlyExtantDuck(tokenId) onlyMachineOwner {
        if (!_isCustomDuck(tokenId)) revert InvalidDuckId();
        if (!_isOnProbation(tokenId)) revert BurnWindowPassed();
        address owner = ownerOf(tokenId);
        _burn(tokenId);
        _numCustomDucks -= 1;
        emit CustomDuckBurned(tokenId, _machineOwner(), owner, reason);
    }

    /**
     * @notice Mint a custom duck directly to specified recipient bypassing minting fees. The resulting duck will have 
     * it's 'Creator' attribute set to the supplied artist parameter.
     */
    function ownerMint(
        address to, 
        string calldata webp, 
        bytes32 artist
    ) external override onlyMachineOwner {                
        if (_numCustomDucks >= machineConfig.maxCustomDucks) 
            revert CustomDuckLimitReached();        
        if (_nextCustomDuckTokenId + TOZZI_DUCKS == OWNERSHIP_TOKEN_ID) 
            _nextCustomDuckTokenId += 1;
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        if (duckExists[webpHash]) revert DuckAlreadyExists();
        duckExists[webpHash] = true;
        uint256 tokenId = TOZZI_DUCKS + (_nextCustomDuckTokenId++);
        address pointer = SSTORE2.write(bytes(webp));
        duckImageData[tokenId] = pointer;
        _safeMint(to, tokenId);
        artists[tokenId] = artist;
        customDuckHatchedTimes[tokenId] = block.timestamp;
        _numCustomDucks += 1;
        emit DuckMinted(
            tokenId,
            to,
            DuckType.Custom,
            machineConfig.customDuckPrice
        );
    }

    /**
     * @notice Mint one of 200 official Tozzi Ducks created by Jim Tozzi. Image storage costs paid by minter.
     * @dev User supplies webp data to be stored on chain. The provided proof is used verify that provided
     * duck image data is legit. 
     */
    function mintTozziDuck(
        uint256 duckId,
        string calldata webp,
        bytes32[] calldata merkleProof
    ) external override payable {
        if (machineConfig.tozziDuckMintStatus == MintStatus.Disabled)
            revert MintingDisabled(DuckType.Tozzi);
        if (msg.value != machineConfig.tozziDuckPrice)
            revert IncorrectDuckPrice();
        if (machineConfig.tozziDuckMintStatus == MintStatus.Allow) {
            if (duckAllowances[_msgSender()].tozziDuckAllowance <= 0)
                revert InsufficientDuckAllowance();
            duckAllowances[_msgSender()].tozziDuckAllowance--;
        }
        bytes32 node = keccak256(abi.encodePacked(duckId, webp));
        if (!MerkleProof.verify(merkleProof, MERKLE_ROOT, node))
            revert InvalidProof();
        address pointer = SSTORE2.write(bytes(webp));
        duckImageData[duckId] = pointer;
        _safeMint(_msgSender(), duckId);
        emit DuckMinted(
            duckId,
            _msgSender(),
            DuckType.Tozzi,
            machineConfig.tozziDuckPrice
        );
    }

    /**
     * @notice Mint your very own custom duck. Minter pays fees associated with on-chain storage of webp image data. Newly minted
     * custom ducks are born into a 1 WEEK probation period. While under probation, custom ducks can be destroyed by the machine's
     * current owner.
     */
    function mintCustomDuck(string calldata webp) external override payable {
        if (machineConfig.customDuckMintStatus == MintStatus.Disabled)
            revert MintingDisabled(DuckType.Custom);
        if (_numCustomDucks >= machineConfig.maxCustomDucks)
            revert CustomDuckLimitReached();
        if (msg.value != machineConfig.customDuckPrice)
            revert IncorrectDuckPrice();
        if (machineConfig.customDuckMintStatus == MintStatus.Allow) {
            if (duckAllowances[_msgSender()].customDuckAllowance <= 0)
                revert InsufficientDuckAllowance();
            duckAllowances[_msgSender()].customDuckAllowance--;
        }
        if (_nextCustomDuckTokenId + TOZZI_DUCKS == OWNERSHIP_TOKEN_ID)
            _nextCustomDuckTokenId += 1;
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        if (duckExists[webpHash]) revert DuckAlreadyExists();
        duckExists[webpHash] = true;
        uint256 tokenId = TOZZI_DUCKS + (_nextCustomDuckTokenId++);
        address pointer = SSTORE2.write(bytes(webp));
        duckImageData[tokenId] = pointer;
        _safeMint(_msgSender(), tokenId);
        duckCreators[tokenId] = _msgSender();
        customDuckHatchedTimes[tokenId] = block.timestamp;
        _numCustomDucks += 1;
        emit DuckMinted(
            tokenId,
            _msgSender(),
            DuckType.Custom,
            machineConfig.customDuckPrice
        );
    }

    function tokenURI(uint256 tokenId) public view override onlyExtantDuck(tokenId) returns (string memory) {
        if (tokenId == OWNERSHIP_TOKEN_ID) return _ownershipTokenURI;        
        
        DuckProfile memory profile = duckProfiles[tokenId];
        string memory name = _defaultDuckName(tokenId);
        string memory description = name;
        if (!_isEmptyBytes32(profile.name)) name = _bytes32ToString(profile.name);
        console.log(name);
        if (bytes(profile.description).length > 0) description = profile.description;
        string memory image = string(abi.encodePacked("data:image/webp;base64,", string(SSTORE2.read(duckImageData[tokenId]))));        

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(abi.encodePacked(
                '{', 
                    '"name":"', name, '",', 
                    '"description":"', description, '",', 
                    '"image": "', image, '",',
                    '"attributes":', _generateMetadataAttributes(tokenId, profile),
                '}'
            ))
        ));
    }

    /**
     * @notice After all ... Why shouldn't you take profits?
     */
    function withdraw(address recipient, uint256 amount) external override onlyMachineOwner {
        if (amount > address(this).balance) revert InsufficientFunds();
        if (amount == 0) revert AmountMustBeNonZero();
        SafeTransferLib.safeTransferETH(recipient, amount);
    }

    function _getDuckCreator(uint256 tokenId) internal view returns (string memory) {
        if (tokenId < TOZZI_DUCKS) return "Jim Tozzi";
        bytes32 artist = artists[tokenId];
        if (!_isEmptyBytes32(artist)) {
            return string(abi.encodePacked(_bytes32ToString(artist)));
        }        
        return string(abi.encodePacked(_addressToString(duckCreators[tokenId])));
    }

    function _generateMetadataAttributes(
        uint256 tokenId, 
        DuckProfile memory profile
    ) internal view returns (string memory attributes) {
        string memory duckType = _isTozziDuck(tokenId) ? "Tozzi" : "Custom";
        string memory creator = _getDuckCreator(tokenId);
        
        bytes memory _attributes = abi.encodePacked(
            '{',
                '"trait_type": "Duck Type",', 
                '"value":', '"', duckType, '"',
            '},'
            '{', 
                '"trait_type": "Creator",',
                '"value":', '"', creator, '"',
            '}'
        );

        if (_isOnProbation(tokenId)) {
            _attributes = abi.encodePacked(
                _attributes, 
                ',', 
                '{', 
                    '"trait_type": "Status",',
                    '"value": "Probation"',
                '}'
            );
        } else if (!_isEmptyBytes32(profile.status)) {
            _attributes = abi.encodePacked(
                _attributes, 
                ',', 
                '{', 
                    '"trait_type": "Status",',
                    '"value":', '"', _bytes32ToString(profile.status), '"',
                '}'
            );
        }

        bytes32 title = duckTitles[tokenId];
        if (!_isEmptyBytes32(title)) {
            _attributes = abi.encodePacked(
                _attributes, 
                ',', 
                '{', 
                    '"trait_type": "Title",',
                    '"value":', '"', _bytes32ToString(title), '"',
                '}'
            );
        }

        return string(abi.encodePacked('[', _attributes, ']'));
    }

    function _addressToString(address _address) internal pure returns (string memory) {
        return Strings.toHexString(uint256(uint160(_address)), 20);
    }

    function _machineOwner() internal view returns (address machineOwner) {
        return ownerOf(OWNERSHIP_TOKEN_ID);
    }

    function _isTozziDuck(uint256 tokenId) internal pure returns (bool) {
        return tokenId < TOZZI_DUCKS;
    }

    function _isCustomDuck(uint256 tokenId) internal pure returns (bool) {
        return tokenId >= TOZZI_DUCKS && tokenId != OWNERSHIP_TOKEN_ID;
    }

    function _defaultDuckName(uint256 tokenId) internal pure returns (string memory) {
        return string(abi.encodePacked("Tozzi Duck ", tokenId.toString()));       
    }

    function _isEmptyBytes32(bytes32 _bytes32) internal pure returns (bool) {
        bytes32 empty;
        return _bytes32 == empty;
    }

    function _isOnProbation(uint256 tokenId) internal view returns (bool) {
        if (!_isCustomDuck(tokenId)) return false;
        return block.timestamp <= customDuckHatchedTimes[tokenId] + probationPeriod;
    }

    function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}