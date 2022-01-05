// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TokenIdCalculator {
  function toHexDigit(uint8 d) internal pure returns (bytes1) {
    if (0 <= d && d <= 9) {
      return bytes1(uint8(bytes1("0")) + d);
    } else if (10 <= uint8(d) && uint8(d) <= 15) {
      return bytes1(uint8(bytes1("a")) + d - 10);
    }
    revert();
  }

  function fromCode(bytes memory code) public pure returns (string memory) {
    bytes memory result = new bytes(66);
    result[0] = bytes1("0");
    result[1] = bytes1("x");
    for (uint256 i = 0; i < code.length; ++i) {
      result[2 * i + 2] = toHexDigit(uint8(code[i]) / 16);
      result[2 * i + 3] = toHexDigit(uint8(code[i]) % 16);
    }
    return string(result);
  }

  constructor() {
    uint256 tokenId = 1;
    bytes memory tokenIdBytes = new bytes(32);
    bytes memory result;
    assembly {
      mstore(add(tokenIdBytes, 32), tokenId)
    }
    console.log("TokenId", fromCode(tokenIdBytes));
  }
}
