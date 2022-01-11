// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "ds-test/test.sol";

library Constants {
    function getArray() public view returns (bytes32[] memory) {
        bytes32[] memory proof = new bytes32[](3);
        proof[0] = 0x06570d1dea13d007b7788ef942a8b8b7633bcae9a45d1f37355a5105ca3fd5cb;
        proof[1] = 0x8e9049b131eac705735dc3d211d68e5b06e76664ed4fb427bacbf0f72c44fb96;
        proof[2] = 0xccdb13fad8ae8682a348b83d401c1d492d633ec2b0182cdbcbfc143ff0ca7973;
        return proof;
    }
}

contract Test {
    bool public ingested = false;

    function ingest(bytes32[] calldata array) public {
        ingested = true;
    }
}

contract FaultyTest is DSTest {

    Test test;

    function setUp() public {
        test = new Test();
    }

    function test_ingest() public {
        test.ingest(Constants.getArray());
        assertTrue(test.ingested());
    }

}