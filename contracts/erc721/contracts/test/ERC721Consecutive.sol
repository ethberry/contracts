// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../preset/ERC721ABRK.sol";

contract ERC721ConsecutiveTest is ERC721ABRK {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABRK(name, symbol, royaltyNumerator)
  {
    _mintConsecutive(0x000000000000000000000000000000000000dEaD, 100);
  }
}
