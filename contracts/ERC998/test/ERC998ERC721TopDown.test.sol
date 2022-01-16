// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC998ERC721TopDown.sol";

contract ERC998ERC721TopDownTest is ERC998ERC721TopDown {

  constructor (
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC998ERC721TopDown(name, symbol, baseTokenURI, 1000) {

  }
}
