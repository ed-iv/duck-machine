// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

interface ITheAmazingTozziDuckMachine {
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
    error InvalidDuckStatus();

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
        bytes data;
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
        uint256 duckId,
        address updatedBy,
        DuckProfile profile
    );

    event DuckStatusUpdated(
        uint256 indexed duckId,
        string indexed status,
        address who
    );

    function setMachineConfig(MachineConfig calldata _machineConfig) external;
    function setDuckAllowance(address who, uint128 tozziDuckAllowance, uint128 customDuckAllowance) external;
    function setDuckProfile(uint256 tokenId, string calldata _name, string calldata _description, bytes calldata _data) external;
    function withdraw(address recipient, uint256 amount) external;
    function burnRenegadeDuck(uint256 duckId, string calldata reason) external;
    function mintTozziDuck(uint256 duckId, string calldata webp, bytes32[] calldata merkleProof) external payable;
    function mintCustomDuck(string calldata webp) external payable;
}
