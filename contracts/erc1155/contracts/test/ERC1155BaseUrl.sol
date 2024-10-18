// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155AB } from "../preset/ERC1155AB.sol";
import {ERC1155ABaseUrl} from "../extensions/ERC1155ABaseUrl.sol";

contract ERC1155BaseUrlTest is ERC1155AB, ERC1155ABaseUrl {
  constructor(string memory url) ERC1155AB(url) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return url(super.uri(tokenId));
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155AB, ERC1155ABaseUrl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
