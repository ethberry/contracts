// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../preset/ERC998ERC20ERC721TopDown.sol";

contract ERC998ComposableTopDownTest is ERC998ERC20ERC721TopDown {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC998ERC20ERC721TopDown(name, symbol, baseTokenURI, 1000) {}
}
