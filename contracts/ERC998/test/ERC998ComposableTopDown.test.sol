// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ComposableTopDown.sol";

contract ERC998ComposableTopDownTest is ComposableTopDown {

  constructor (
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ComposableTopDown(name, symbol, baseTokenURI, 1000) {

  }
}
