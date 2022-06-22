// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

interface ITheAmazingTozziDuckMachine {
    error Unauthorized();
    error MintingDisabled(DuckType duckType);
    error IncorrectDuckPrice();
    error InvalidProof();
    error BurnWindowPassed();
    error InsufficientFunds();
    error InvalidDuckId();
    error AmountMustBeNonZero();
    error InsufficientDuckAllowance();
    error CustomDuckLimitReached();
    error DuckAlreadyExists();
    error InvalidStatusId();

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
    }

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
        uint256 indexed duckId,
        string name,
        string description
    );

    event DuckStatusUpdated(
        uint256 indexed duckId,
        uint8 indexed statusId,        
        string statusName,
        address indexed who
    );

    event DuckStatusDefined(
        uint8 indexed statusId,
        string statusName
    );

    event MOTDSet(address indexed owner, string message);

    function setMachineConfig(MachineConfig calldata _machineConfig) external;
    function setMOTD(string calldata motd) external;
    function setDuckAllowance(address who, uint128 tozziDuckAllowance, uint128 customDuckAllowance) external;
    function setDuckStatus(uint256 tokenId, uint8 statusId) external;
    function getDuckStatus(uint256 tokenId) external returns (string memory statusName);
    function setDuckProfile(uint256 tokenId, string calldata _name, string calldata _description) external;
    function withdraw(address recipient, uint256 amount) external;
    function burnRenegadeDuck(uint256 duckId, string calldata reason) external;
    function mintTozziDuck(uint256 duckId, string calldata webp, bytes32[] calldata merkleProof) external payable;
    function mintCustomDuck(string calldata webp) external payable;
}
