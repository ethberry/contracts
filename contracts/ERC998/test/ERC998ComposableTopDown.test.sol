// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC998TopDown.sol";

contract ERC998ComposableTopDownTest is ERC998TopDown {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC998TopDown(name, symbol, baseTokenURI, 1000) {}
}
