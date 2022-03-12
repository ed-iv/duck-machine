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
 *                                                                   *
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "./lib/base64.sol";
import "@rari-capital/solmate/src/utils/SSTORE2.sol";
import "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import "./OwnableByERC721.sol";
import "hardhat/console.sol";

enum DuckType {
    Tozzi,
    Custom
}

contract TheAmazingTozziDuckMachine is ERC721, OwnableByERC721 {
    using Strings for uint256;

    struct MachineSetting {
        uint256 tozziDuckPrice;
        uint256 customDuckPrice;
        uint256 maxCustomDucks;
        bool tozziDucksEnabled;
        bool customDucksEnabled;
    }

    MachineSetting public machineSetting;

    uint256 public constant BURN_WINDOW = 1 weeks;

    mapping(uint256 => address) public duckIdToWEBP;
    mapping(bytes32 => bool) public isCustomExisting;
    mapping(uint256 => uint256) public customDuckHatchedTimes;

    string private _contractURI;
    uint256 private _customCounter;
    bytes32 private constant _MERKLE_ROOT =
        0x0885f98e28c44d2dd7b21d5b9e2661e99e90482a771a419967dd2c9c8edfb0d7;

    event DuckPriceUpdated(
        DuckType indexed duckType,
        address indexed who,
        uint256 price
    );

    event MaxCustomDucksUpdated(address indexed who, uint256 newMaxCustomDucks);

    event DuckMintingStatusUpdated(
        DuckType indexed duckType,
        address indexed who,
        bool isEnabled
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

    constructor(address chainsawProjects)
        ERC721("Tozzi Ducks", "TZDUCKS")
        OwnableByERC721(chainsawProjects)
    {}

    function setMachineSetting(MachineSetting memory setting) public onlyOwner {
        machineSetting = setting;
    }

    function withdraw(address recipient, uint256 amount) public onlyOwner {
        require(
            amount <= address(this).balance,
            "The amount has been exceeded."
        );
        if (amount == 0) amount = address(this).balance;
        SafeTransferLib.safeTransferETH(recipient, amount);
    }

    function burnRenegadeDuck(uint256 duckId, string calldata reason)
        public
        onlyOwner
    {
        require(duckId >= 200, "Tozzi duck can't be burned.");
        require(_exists(duckId), "Duck does not exist.");
        uint256 curTime = block.timestamp;
        require(
            curTime <= customDuckHatchedTimes[duckId] + BURN_WINDOW,
            "Burn window has passed"
        );
        address duckOwner = ownerOf(duckId);
        _burn(duckId);
        emit CustomDuckBurned(duckId, owner(), duckOwner, reason);
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
            machineSetting.tozziDucksEnabled,
            "Minting of Tozzi Ducks is disabled"
        );
        require(
            msg.value == machineSetting.tozziDuckPrice,
            "msg.value != duck price"
        );
        bytes32 node = keccak256(abi.encodePacked(duckId, webp));
        require(
            MerkleProof.verify(merkleProof, _MERKLE_ROOT, node),
            "invalid proof"
        );
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[duckId] = pointer;
        _safeMint(msg.sender, duckId);
        emit DuckMinted(
            DuckType.Tozzi,
            msg.sender,
            duckId,
            machineSetting.tozziDuckPrice
        );
    }

    function mintCustomDuck(string calldata webp) public payable {
        require(
            machineSetting.customDucksEnabled,
            "Minting of Custom Ducks is disabled"
        );
        require(
            _customCounter + 1 <= machineSetting.maxCustomDucks,
            "Custom duck limit reached"
        );
        require(
            msg.value == machineSetting.customDuckPrice,
            "msg.value != duck price"
        );
        bytes32 webpHash = keccak256(abi.encodePacked(webp));
        require(!isCustomExisting[webpHash], "Custom duck already exists");
        isCustomExisting[webpHash] = true;
        uint256 tokenId = 200 + (_customCounter++);
        address pointer = SSTORE2.write(bytes(webp));
        duckIdToWEBP[tokenId] = pointer;
        _safeMint(msg.sender, tokenId);
        customDuckHatchedTimes[tokenId] = block.timestamp;
        emit DuckMinted(
            DuckType.Custom,
            msg.sender,
            tokenId,
            machineSetting.tozziDuckPrice
        );
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory webp = string(SSTORE2.read(duckIdToWEBP[tokenId]));
        if (tokenId < 200)
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

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
