// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../chainsawProjects.sol";
import "../TheAmazingDuckMachine.sol";
import "./utils/HEVM.sol";
import "./utils/Constants.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "ds-test/test.sol";

contract TheAmazingDuckMachineTest is DSTest, HEVM, ERC721Holder {
    using Strings for uint256;

    ChainsawProjects chainsawProjects;
    TheAmazingDuckMachine adm;

    Constants constants = new Constants();

    function setUp() public {
        chainsawProjects = new ChainsawProjects();
        adm = new TheAmazingDuckMachine(address(chainsawProjects));
        chainsawProjects.addProject("The Amazing Duck Machine", address(adm));
    }

    function test_AdmOwnerIsERC721Owner() public {
        assertEq(adm.owner(), chainsawProjects.ownerOf(0));
        assertEq(adm.owner(), address(this));
    }

    function test_mintTozzi() public {
        adm.flipTozziStatus();
        adm.mintTozziDuck(0, constants.duck0(), constants.getProof0());
        assertEq(adm.ownerOf(0), address(this));
    }

    function testFail_CannotMintSameTozziTwice() public {
        adm.flipTozziStatus();
        adm.mintTozziDuck(0, constants.duck0(), constants.getProof0());
        adm.mintTozziDuck(0, constants.duck0(), constants.getProof0());
    }

    function test_mintCustom() public {
        adm.flipCustomStatus();
        adm.setMaxCustomDucks(1);
        adm.mintCustomDuck("");
        assertEq(adm.ownerOf(200), address(this));
    }


}