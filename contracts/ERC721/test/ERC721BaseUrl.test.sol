// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721BaseUrl.sol";
import "../preset/ERC721ACB.sol";

contract ERC721BaseUrlTest is ERC721BaseUrl, ERC721ACB {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721ACB(name, symbol, baseTokenURI) {}

  function _baseURI() internal view virtual override(ERC721ACB) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }
}
