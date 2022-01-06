// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC20/ERC20Gemunion.sol";

contract ERC20GemunionTest is ERC20Gemunion {
  constructor (
    string memory name,
    string memory symbol
  ) ERC20Gemunion(name, symbol, 100) {}
}