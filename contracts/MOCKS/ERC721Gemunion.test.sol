// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721/ERC721Gemunion.sol";

contract ERC721GemunionTest is ERC721Gemunion {
  constructor (
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721Gemunion(name, symbol, baseTokenURI, 2) {

  }
}