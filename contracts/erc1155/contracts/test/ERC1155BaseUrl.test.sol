// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../preset/ERC1155AB.sol";
import "../extensions/ERC1155BaseUrl.sol";

contract ERC1155BaseUrlTest is ERC1155AB, ERC1155BaseUrl {
  constructor(string memory url) ERC1155AB(url) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return url(super.uri(tokenId));
  }
}
