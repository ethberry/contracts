// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC998ERC721TopDownWhiteListChild.sol";

contract ERC998ERC721TopDownWhiteListChildTest is ERC998ERC721TopDownWhiteListChild {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC998ERC721TopDownWhiteListChild(name, symbol, baseTokenURI, 1000) {}
}
