// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ComposableBottomUp.sol";

contract ERC998ComposableBottomUpTest is ComposableBottomUp {

  constructor (
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ComposableBottomUp(name, symbol, baseTokenURI, 1000) {

  }
}
