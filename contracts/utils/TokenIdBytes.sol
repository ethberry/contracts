// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract TokenIdCalculator {
  constructor() {
    console.log("TokenId", Strings.toHexString(1, 32));
  }
}
