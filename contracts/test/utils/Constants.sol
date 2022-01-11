// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Constants {
    string constant public duck0 = "UklGRsYBAABXRUJQVlA4TLoBAAAvj8FjAD+gEAAaJo1M00rnjGUaZAIW+5TSTjWZvBQFIAP5KaO0mHbOfwDE4XlpsekUnCkCSI0kSZKcQlEoCkOhKAyFpVD8FaHI6mPnl1JE/ydgP5Wj+ydvgdDvUY4mVJsw9HtvLm690O/rcr65Qr//LGHrxW1vkaK9Fk+9j0UbKUuY8Pz7WLSRsqY8H5jY1itN7BmOGpvY1gudT0WN7ckIS1TNWZOeQffrdkToJ0QN+qmiV23lfF9l0U/1MTYpd11Tz0wlvMCiF9iWijAhLFF9gk1sI4UufRZHr7Jmv2RHZNFSesauo4QXvGoLxG2XJjZZIaGxbRa6bsv5dR41Fu2r0BVytHRzdCnaa6HrKEdvga6jzZVFV0h1qRkht00I94v3QZZwh8YuRU36Vx1qVoju/7MPuhpdipq/6ggTdP+UfZBFl6LJCNGl6P5R26JRRZei+5ftgyy6lOpSdP/GfZBFV5WwY0vRGfZu6Kwa26wRlqyxLRo6QjRBR4g2axYdWrJoT4aOKjqqaGKp9l+EJYsadFTRWSVsuNAZogk6q6ghLFlj2yx0HiWc59F5x/4LnU9FSxZtuAifZTsn";
    
    function getProof0() public pure returns (bytes32[] memory) {
        bytes32[] memory proof = new bytes32[](8);
        proof[0] = 0x06570d1dea13d007b7788ef942a8b8b7633bcae9a45d1f37355a5105ca3fd5cb;
        proof[1] = 0x8e9049b131eac705735dc3d211d68e5b06e76664ed4fb427bacbf0f72c44fb96;
        proof[2] = 0xccdb13fad8ae8682a348b83d401c1d492d633ec2b0182cdbcbfc143ff0ca7973;
        proof[3] = 0xae1504ba3770b32d6dc16f7ba1ee06ff1b06f36ac6316e866aef015467e196e0;
        proof[4] = 0xf13be6a5acc23fda9f9cea5f3a165a59aaf7b30105882785bbdbe31ec58c75a5;
        proof[5] = 0xb9df2daee59ffee78bd60db452b487861d62ecd3664709c74269d8d10e5416b1;
        proof[6] = 0x4bd3935c39cece4e9545f8d01c87d688b1c6245c4f4d04637c20b867a5479b14;
        proof[7] = 0x19ba426e56552de3394df8b342f2df142f6a5e2716f3fe14c47f5747f5965c93;
        return proof;
    }
}