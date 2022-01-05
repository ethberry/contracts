// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./Formatter.sol";

contract TokenIdCalculator is Formatter {
  constructor() {
    uint256 tokenId = 1;
    bytes memory tokenIdBytes = new bytes(32);
    assembly {
      mstore(add(tokenIdBytes, 32), tokenId)
    }
    console.log("TokenId", fromCode(tokenIdBytes));
  }
}
