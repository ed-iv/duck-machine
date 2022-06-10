// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

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
 *            ___  __/__________________(_)   ___  __ \___  __________  /_________
 *            __  /  _  __ \__  /__  /_  /    __  / / /  / / /  ___/_  //_/_  ___/
 *           _  /   / /_/ /_  /__  /_  /     _  /_/ // /_/ // /__ _  ,<  _(__  )
 *            /_/    \____/_____/____/_/      /_____/ \__,_/ \___/ /_/|_| /____/
 *
 */

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Base64} from "./lib/base64.sol";
import "@rari-capital/solmate/src/utils/SSTORE2.sol";
import "@rari-capital/solmate/src/utils/SafeTransferLib.sol";

error Unauthorized();
error ThatAintNoDuck();
error MintingDisabled(DuckType duckType);
error IncorrectDuckPrice();
error InvalidProof();
error BurnWindowHasPassed();
error InsufficientFunds();
error InvalidDuckId();
error AmountMustBeNonZero();
error InsufficientDuckAllowance();
error CustomDuckLimitReached();
error DuckAlreadyExists();

enum DuckType {
    Tozzi,
    Custom
}

enum MintStatus {
    Enabled,
    Disabled,
    duckAllowances
}

struct MachineConfig {
    uint256 tozziDuckPrice;
    uint256 customDuckPrice;
    uint256 maxCustomDucks;
    MintStatus tozziDuckMintStatus;
    MintStatus customDuckMintStatus;
}

struct DuckAllowance {
    uint128 tozziDuckAllowance;
    uint128 customDuckAllowance;
}

struct DuckStance {
    string stance;
    uint256 timeout;
}

struct DuckProfile {
    string name;
    string description;
    DuckStance stance;
    uint256 updated;
}

contract TheAmazingTozziDuckMachine is ERC721Enumerable {
    using Strings for uint256;    
    
    uint256 private constant _tozziDucks = 200;
    bytes32 private constant _MERKLE_ROOT = 0x0885f98e28c44d2dd7b21d5b9e2661e99e90482a771a419967dd2c9c8edfb0d7;
    uint256 private _customCounter;
    string private _ownershipTokenURI;
    uint256 public constant BURN_WINDOW = 1 weeks;
    uint256 public constant OWNERSHIP_TOKEN_ID = 420;
    MachineConfig public machineConfig;
    mapping(uint256 => address) public duckCreators;
    mapping(address => DuckAllowance) public duckAllowances;
    mapping(uint256 => DuckProfile) public duckProfiles;
    mapping(uint256 => address) public duckIdToWEBP;
    mapping(bytes32 => bool) public duckExists;
    mapping(uint256 => uint256) public customDuckHatchedTimes;

    event MachineConfigUpdated(
        address indexed who,
        uint256 tozziDuckPrice,
        uint256 customDuckPrice,
        uint256 maxCustomDucks,
        MintStatus tozziDuckMintStatus,
        MintStatus customDuckMintStatus
    );

    event DuckMinted(
        uint256 indexed tokenId,
        address indexed who,
        DuckType indexed duckType,
        uint256 price
    );

    event CustomDuckBurned(
        uint256 duckId,
        address admin,
        address owner,
        string reason
    );

    event DuckProfileUpdated(
        uint256 duckId,
        address updatedBy,
        DuckProfile profile
    );

    modifier onlyOwner() {
        if (ownerOf(OWNERSHIP_TOKEN_ID) != _msgSender()) revert Unauthorized();
        _;
    }

    constructor(MachineConfig memory config, string memory ownershipTokenURI)
        ERC721("Tozzi Ducks", "TZDUCKS")
    {
        machineConfig = config;
        _ownershipTokenURI = ownershipTokenURI;
        _safeMint(_msgSender(), OWNERSHIP_TOKEN_ID);
    }

    function setMachineConfig(MachineConfig memory config) public onlyOwner {
        machineConfig = config;
        emit MachineConfigUpdated(
            ownerOf(OWNERSHIP_TOKEN_ID),
            config.tozziDuckPrice,
            config.customDuckPrice,
            config.maxCustomDucks,
            config.tozziDuckMintStatus,
            config.customDuckMintStatus
        );
    }

    function setDuckAllowance(
        address who,
        uint128 tozziDuckAllowance,
        uint128 customDuckAllowance
    ) public onlyOwner {
        if (tozziDuckAllowance < 0 || customDuckAllowance < 0)
            revert InsufficientDuckAllowance();
        duckAllowances[who] = DuckAllowance(
            tozziDuckAllowance,
            customDuckAllowance
        );
    }

    function setDuckProfile(
        uint256 tokenId,
        string memory _name,
        string memory _description,
        string memory _stance,
        uint256 _stanceTimeout
    ) public {
        if (
            _msgSender() != ownerOf(OWNERSHIP_TOKEN_ID) &&
            _msgSender() != ownerOf(tokenId)
        ) revert Unauthorized();
        DuckStance memory newStance = DuckStance(_stance, _stanceTimeout);
        DuckProfile memory newProfile = DuckProfile(
            _name,
            _description,
            newStance,
            block.timestamp
        );
        duckProfiles[tokenId] = newProfile;
        emit DuckProfileUpdated(tokenId, _msgSender(), newProfile);
    }

    function withdraw(address recipient, uint256 amount) public onlyOwner {
        if (amount > address(this).balance) revert InsufficientFunds();
        if (amount == 0) revert AmountMustBeNonZero();
        SafeTransferLib.safeTransferETH(recipient, amount);
    }

    function burnRenegadeDuck(uint256 duckId, string calldata reason)
        public
        onlyOwner
    {
        if (
            duckId < _tozziDucks ||
            duckId == OWNERSHIP_TOKEN_ID ||
            !_exists(duckId)
        ) revert InvalidDuckId();
        if (block.timestamp > customDuckHatchedTimes[duckId] + BURN_WINDOW)
            revert BurnWindowHasPassed();
        address duckOwner = ownerOf(duckId);
        _burn(duckId);
        emit CustomDuckBurned(
            duckId,
            ownerOf(OWNERSHIP_TOKEN_ID),
            duckOwner,
            reason
        );
    }

    function mintTozziDuck(
        uint256 duckId,
        string calldata webp,
        bytes32[] calldata merkleProof
    ) public payable {
        if (machineConfig.tozziDuckMintStatus == MintStatus.Disabled)
            revert MintingDisabled(DuckType.Tozzi);
        if (msg.value != machineConfig.tozziDuckPrice)
            revert IncorrectDuckPrice();
        if (machineConfig.tozziDuckMintStatus == MintStatus.duckAllowances) {
            if (duckAllowances[_msgSender()].tozziDuckAllowance <= 0)
                revert InsufficientDuckAllowance();
            duckAllowances[_msgSender()].tozziDuckAllowance--;
        }
        bytes32 node = keccak256(abi.encodePacked(duckId, webp));
        if (!MerkleProof.verify(merkleProof, _MERKLE_ROOT, node))
            revert InvalidProof();
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[duckId] = pointer;
        _safeMint(_msgSender(), duckId);
        emit DuckMinted(
            duckId,
            _msgSender(),
            DuckType.Tozzi,
            machineConfig.tozziDuckPrice
        );
    }

    function mintCustomDuck(string calldata webp) public payable {
        if (machineConfig.customDuckMintStatus == MintStatus.Disabled)
            revert MintingDisabled(DuckType.Custom);
        if (_customCounter >= machineConfig.maxCustomDucks)
            revert CustomDuckLimitReached();
        if (msg.value != machineConfig.customDuckPrice)
            revert IncorrectDuckPrice();
        if (machineConfig.customDuckMintStatus == MintStatus.duckAllowances) {
            if (duckAllowances[_msgSender()].customDuckAllowance <= 0)
                revert InsufficientDuckAllowance();
            duckAllowances[_msgSender()].customDuckAllowance--;
        }
        if (_customCounter + _tozziDucks == OWNERSHIP_TOKEN_ID)
            _customCounter += 1;
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        if (duckExists[webpHash]) revert DuckAlreadyExists();
        duckExists[webpHash] = true;
        uint256 tokenId = _tozziDucks + (_customCounter++);
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[tokenId] = pointer;
        _safeMint(_msgSender(), tokenId);
        duckCreators[tokenId] = _msgSender();
        customDuckHatchedTimes[tokenId] = block.timestamp;
        emit DuckMinted(
            tokenId,
            _msgSender(),
            DuckType.Custom,
            machineConfig.customDuckPrice
        );
    }

    function addressToString(address _address) public pure returns (string memory) {
        return Strings.toHexString(uint256(uint160(_address)), 20);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (tokenId == OWNERSHIP_TOKEN_ID) return _ownershipTokenURI;
        string memory webp = string(SSTORE2.read(duckIdToWEBP[tokenId]));
        string memory duckType;
        string memory creator;
        if (tokenId < _tozziDucks) {
            webp = string(abi.encodePacked("data:image/webp;base64,", webp));
            duckType = "Tozzi";
            creator = "Jim Tozzi";
        } else {
            duckType = "Custom";
            creator = string(abi.encodePacked(addressToString(ownerOf(tokenId))));
        }
        DuckProfile memory profile = duckProfiles[tokenId];
        bytes memory name = abi.encodePacked(
            "Tozzi Duck #",
            tokenId.toString()
        );
        if (bytes(profile.name).length > 0) {
            name = abi.encodePacked(name, " - ", profile.name);
        }
        string memory description = bytes(profile.description).length > 0
            ? profile.description
            : string(name);
        string memory attributes = string(
            bytes(
                abi.encodePacked(
                    '[{"trait_type":"Duck Type","value":"',
                    duckType,
                    '"},{"trait_type":"Creator","value":"',
                    creator,
                    '"},{"trait_type":"Duck Image Complexity","value":"',
                    bytes(webp).length.toString(),
                    '"}]'
                )
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "description":"',
                                description,
                                '", "image": "',
                                webp,
                                '", "attributes":',
                                attributes,
                                '}'
                            )
                        )
                    )
                )
            );
    }
}
