// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC998BottomUp.sol";

contract ERC998ComposableBottomUpTest is ERC998BottomUp {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC998BottomUp(name, symbol, baseTokenURI, 1000) {}
}
