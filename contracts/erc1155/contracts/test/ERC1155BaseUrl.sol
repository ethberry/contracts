// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155AB } from "../preset/ERC1155AB.sol";
import { ERC1155BaseUrl } from "../extensions/ERC1155BaseUrl.sol";

contract ERC1155BaseUrlTest is ERC1155AB, ERC1155BaseUrl {
  constructor(string memory url) ERC1155AB(url) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return url(super.uri(tokenId));
  }
}
