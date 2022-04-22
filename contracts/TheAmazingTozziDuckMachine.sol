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

enum DuckType {
    Tozzi,
    Custom
}

enum MintStatus {
    Enabled,
    Disabled,
    Whitelist
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

contract TheAmazingTozziDuckMachine is ERC721Enumerable {
    using Strings for uint256;

    uint256 private constant _tozziDucks = 200;
    bytes32 private constant _MERKLE_ROOT =
        0x0885f98e28c44d2dd7b21d5b9e2661e99e90482a771a419967dd2c9c8edfb0d7;
    uint256 private _customCounter;
    string private _ownershipTokenURI;        
    uint256 public constant BURN_WINDOW = 1 weeks;
    uint256 public constant OWNERSHIP_TOKEN_ID = 420;
    MachineConfig public machineConfig;
    mapping(address => DuckAllowance) public whitelist;
    mapping(uint256 => address) public duckIdToWEBP;
    mapping(bytes32 => bool) public isCustomExisting;
    mapping(uint256 => uint256) public customDuckHatchedTimes;

    event MachineConfigUpdated(
        MachineConfig indexed machineConfig,
        address indexed who
    );

    event DuckMinted(
        DuckType indexed duckType,
        address indexed who,
        uint256 tokenId,
        uint256 price
    );

    event CustomDuckBurned(
        uint256 duckId,
        address admin,
        address owner,
        string reason
    );

    modifier onlyOwner() {
        require(
            ownerOf(OWNERSHIP_TOKEN_ID) == _msgSender(),
            "caller is not the owner."
        );
        _;
    }

    constructor(string memory ownershipTokenURI)
        ERC721("Tozzi Ducks", "TZDUCKS")
    {
        _ownershipTokenURI = ownershipTokenURI;
        _safeMint(_msgSender(), OWNERSHIP_TOKEN_ID);
    }

    function setMachineConfig(MachineConfig memory setting) public onlyOwner {
        machineConfig = setting;
        emit MachineConfigUpdated(setting, ownerOf(OWNERSHIP_TOKEN_ID));
    }

    function setDuckAllowance(
        address who,
        uint128 tozziDuckAllowance,
        uint128 customDuckAllowance
    ) public onlyOwner {        
        whitelist[who] = DuckAllowance(tozziDuckAllowance, customDuckAllowance);
    }

    function withdraw(address recipient, uint256 amount) public onlyOwner {
        require(
            amount <= address(this).balance,
            "The amount has been exceeded."
        );
        require(amount > 0, "The amount is zero.");
        SafeTransferLib.safeTransferETH(recipient, amount);
    }

    function burnRenegadeDuck(uint256 duckId, string calldata reason)
        public
        onlyOwner
    {
        require(duckId >= _tozziDucks, "Tozzi duck can't be burned.");
        require(duckId != OWNERSHIP_TOKEN_ID, "Ownership token ID.");
        require(_exists(duckId), "Duck does not exist.");
        uint256 curTime = block.timestamp;
        require(
            curTime <= customDuckHatchedTimes[duckId] + BURN_WINDOW,
            "Burn window has passed."
        );
        address duckOwner = ownerOf(duckId);
        _burn(duckId);
        emit CustomDuckBurned(
            duckId,
            ownerOf(OWNERSHIP_TOKEN_ID),
            duckOwner,
            reason
        );
    }

    /**
     * @dev - We don't need to check if proof has already been used because we are minting a particular tokenId.
     */
    function mintTozziDuck(
        uint256 duckId,
        string calldata webp,
        bytes32[] calldata merkleProof
    ) public payable {
        require(
            machineConfig.tozziDuckMintStatus != MintStatus.Disabled,
            "Tozzi Ducks Minting is disabled."
        );
        require(
            msg.value == machineConfig.tozziDuckPrice,
            "msg.value != tozzi duck price"
        );
        if (machineConfig.tozziDuckMintStatus == MintStatus.Whitelist) {
            require(
                whitelist[_msgSender()].tozziDuckAllowance > 0,
                "not allowance"
            );
            whitelist[_msgSender()].tozziDuckAllowance--;
        }
        bytes32 node = keccak256(abi.encodePacked(duckId, webp));
        require(
            MerkleProof.verify(merkleProof, _MERKLE_ROOT, node),
            "Invalid Proof."
        );
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[duckId] = pointer;
        _safeMint(_msgSender(), duckId);
        emit DuckMinted(
            DuckType.Tozzi,
            _msgSender(),
            duckId,
            machineConfig.tozziDuckPrice
        );
    }

    function mintCustomDuck(string calldata webp) public payable {
        if (_customCounter + _tozziDucks == OWNERSHIP_TOKEN_ID)
            _customCounter++;
        require(
            machineConfig.customDuckMintStatus != MintStatus.Disabled,
            "Tozzi Ducks Minting is disabled."
        );
        require(
            _customCounter < machineConfig.maxCustomDucks,
            "Custom duck limit reached."
        );
        require(
            msg.value == machineConfig.customDuckPrice,
            "msg.value != custom duck price"
        );
        if (machineConfig.customDuckMintStatus == MintStatus.Whitelist) {
            require(
                whitelist[_msgSender()].customDuckAllowance > 0,
                "not allowance"
            );
            whitelist[_msgSender()].customDuckAllowance--;
        }
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        require(!isCustomExisting[webpHash], "Custom duck already exists.");
        isCustomExisting[webpHash] = true;
        uint256 tokenId = _tozziDucks + (_customCounter++);
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[tokenId] = pointer;
        _safeMint(_msgSender(), tokenId);
        customDuckHatchedTimes[tokenId] = block.timestamp;
        emit DuckMinted(
            DuckType.Custom,
            _msgSender(),
            tokenId,
            machineConfig.tozziDuckPrice
        );
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (tokenId == OWNERSHIP_TOKEN_ID) return _ownershipTokenURI;
        string memory webp = string(SSTORE2.read(duckIdToWEBP[tokenId]));
        if (tokenId < _tozziDucks)
            webp = string(abi.encodePacked("data:image/webp;base64,", webp));
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "Tozzi Duck #",
                                tokenId.toString(),
                                '", "description":"',
                                "Hell yeah!",
                                '", "image": "',
                                webp,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
