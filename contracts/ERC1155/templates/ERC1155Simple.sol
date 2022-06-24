// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../preset/ERC1155ACBS.sol";
import "../ERC1155BaseUrl.sol";

contract ERC1155Simple is ERC1155ACBS, ERC1155BaseUrl {
  constructor(string memory baseTokenURI) ERC1155ACBS(baseTokenURI) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return url(super.uri(tokenId));
  }
}
