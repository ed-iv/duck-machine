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

import "./interfaces/ITheAmazingTozziDuckMachine.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@rari-capital/solmate/src/utils/SSTORE2.sol";
import "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {Base64} from "./lib/base64.sol";


contract TheAmazingTozziDuckMachine is ITheAmazingTozziDuckMachine, ERC721Enumerable, Ownable {
    using Strings for uint256;    
    
    uint256 private constant TOZZI_DUCKS = 200;
    uint256 private constant BURN_WINDOW = 1 weeks;
    uint256 public constant OWNERSHIP_TOKEN_ID = 420;
    bytes32 private constant MERKLE_ROOT = 0x0885f98e28c44d2dd7b21d5b9e2661e99e90482a771a419967dd2c9c8edfb0d7;    
    uint256 private _customDuckCounter;
    string private _ownershipTokenURI;    
    MachineConfig public machineConfig;
    mapping(uint256 => address) public duckCreators;
    mapping(address => DuckAllowance) public duckAllowances;
    mapping(uint8 => string) public duckStatusOptions;
    mapping(uint256 => uint8) public duckStatuses;
    mapping(uint256 => DuckProfile) public duckProfiles;
    mapping(uint256 => address) public duckIdToWEBP;
    mapping(bytes32 => bool) public duckExists;
    mapping(uint256 => uint256) public customDuckHatchedTimes;
    
    modifier onlyMachineOwner() {
        if (ownerOf(OWNERSHIP_TOKEN_ID) != _msgSender()) revert Unauthorized();
        _;
    }

    constructor(MachineConfig memory _machineConfig, string memory ownershipTokenURI)
        ERC721("Tozzi Ducks", "TZDUCKS")
    {
        machineConfig = _machineConfig;
        _ownershipTokenURI = ownershipTokenURI;
        _safeMint(_msgSender(), OWNERSHIP_TOKEN_ID);
    }

    function setMachineConfig(MachineConfig calldata _machineConfig) external override onlyMachineOwner {
        machineConfig = _machineConfig;
        emit MachineConfigUpdated(
            ownerOf(OWNERSHIP_TOKEN_ID),
            _machineConfig.tozziDuckPrice,
            _machineConfig.customDuckPrice,
            _machineConfig.maxCustomDucks,
            _machineConfig.tozziDuckMintStatus,
            _machineConfig.customDuckMintStatus
        );
    }

    function setMOTD(string calldata motd) external override onlyMachineOwner {
        emit MOTDSet(_msgSender(), motd);
    }

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

    function defineDuckStatus(uint8 statusId, string calldata statusName) external onlyMachineOwner {
        if (statusId == 0) revert InvalidStatusId();
        duckStatusOptions[statusId] = statusName;
        emit DuckStatusDefined(statusId, statusName);
    }

    function setDuckStatus(uint256 tokenId, uint8 statusId) external override {
        require(_exists(tokenId), "ERC721: owner query for nonexistent token");
        string memory statusName = duckStatusOptions[statusId];
        if (_isEmptyString(statusName) && statusId != 0) revert InvalidStatusId();
        if (_msgSender() != ownerOf(tokenId)) revert Unauthorized();
        duckStatuses[tokenId] = statusId;
        emit DuckStatusUpdated(tokenId, statusId, statusName, _msgSender());
    }

    function getDuckStatus(uint256 tokenId) external override view returns (string memory statusName) {
        require(_exists(tokenId), "ERC721: owner query for nonexistent token");
        return duckStatusOptions[duckStatuses[tokenId]];
    }

    function setDuckProfile(
        uint256 tokenId,
        string calldata _name,
        string calldata _description
    ) external override onlyMachineOwner {
        duckProfiles[tokenId] = DuckProfile(_name, _description);
        emit DuckProfileUpdated(tokenId, _name, _description);
    }

    function _isEmptyString(string memory str) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str)) == keccak256(abi.encodePacked(""));
    }

    function withdraw(address recipient, uint256 amount) external override onlyMachineOwner {
        if (amount > address(this).balance) revert InsufficientFunds();
        if (amount == 0) revert AmountMustBeNonZero();
        SafeTransferLib.safeTransferETH(recipient, amount);
    }

    function burnRenegadeDuck(uint256 duckId, string calldata reason) external override onlyMachineOwner {
        if (
            duckId < TOZZI_DUCKS ||
            duckId == OWNERSHIP_TOKEN_ID ||
            !_exists(duckId)
        ) revert InvalidDuckId();
        if (block.timestamp > customDuckHatchedTimes[duckId] + BURN_WINDOW)
            revert BurnWindowPassed();
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
    ) external override payable {
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
        if (!MerkleProof.verify(merkleProof, MERKLE_ROOT, node))
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

    function mintCustomDuck(string calldata webp) external override payable {
        if (machineConfig.customDuckMintStatus == MintStatus.Disabled)
            revert MintingDisabled(DuckType.Custom);
        if (_customDuckCounter >= machineConfig.maxCustomDucks)
            revert CustomDuckLimitReached();
        if (msg.value != machineConfig.customDuckPrice)
            revert IncorrectDuckPrice();
        if (machineConfig.customDuckMintStatus == MintStatus.duckAllowances) {
            if (duckAllowances[_msgSender()].customDuckAllowance <= 0)
                revert InsufficientDuckAllowance();
            duckAllowances[_msgSender()].customDuckAllowance--;
        }
        if (_customDuckCounter + TOZZI_DUCKS == OWNERSHIP_TOKEN_ID)
            _customDuckCounter += 1;
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        if (duckExists[webpHash]) revert DuckAlreadyExists();
        duckExists[webpHash] = true;
        uint256 tokenId = TOZZI_DUCKS + (_customDuckCounter++);
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

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721: owner query for nonexistent token");
        if (tokenId == OWNERSHIP_TOKEN_ID) return _ownershipTokenURI;        

        DuckProfile memory profile = duckProfiles[tokenId];
        string memory name = string(abi.encodePacked("Tozzi Duck #", tokenId.toString()));        
        if (bytes(profile.name).length > 0) name = string(abi.encodePacked(name, " - ", profile.name));
        string memory description = bytes(profile.description).length > 0 ? profile.description : string(name);
        string memory image = string(abi.encodePacked(
            "data:image/webp;base64,", string(SSTORE2.read(duckIdToWEBP[tokenId])
        )));
        string memory attributes = _generateMetadataAttributes(tokenId);
        
        return
            string(abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    abi.encodePacked(
                        '{', 
                            '"name":"', name, '",', 
                            '"description":"', description, '",', 
                            '"image": "', image, '",',
                            '"attributes":', attributes,
                        '}'
                    )
                )
            ));
    }

    function _generateMetadataAttributes(uint256 tokenId) internal view returns (string memory attributes) {
        string memory duckType;
        string memory creator;
        if (tokenId < TOZZI_DUCKS) {
            duckType = "Tozzi";
            creator = "Jim Tozzi";
        } else {
            duckType = "Custom";
            creator = string(abi.encodePacked(_addressToString(duckCreators[tokenId])));
        }
        return string(bytes(abi.encodePacked(
            '[{"trait_type":"Duck Type","value":"',
            duckType,
            '"},{"trait_type":"Creator","value":"',
            creator,
            '"}]'
        )));
    }
    
    function _addressToString(address _address) internal pure returns (string memory) {
        return Strings.toHexString(uint256(uint160(_address)), 20);
    }
}
