// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC1155BaseUrl.sol";
import "../preset/ERC1155ACB.sol";

contract ERC1155BaseUrlTest is ERC1155BaseUrl, ERC1155ACB {
  constructor(string memory uri) ERC1155ACB(uri) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return uri(super.uri(tokenId));
  }
}
