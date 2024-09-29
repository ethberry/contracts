// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { ERC721ABRS } from "../preset/ERC721ABRS.sol";
import { ERC721ABaseUrl } from "../extensions/ERC721ABaseUrl.sol";

contract ERC721BaseUrlTest is ERC721ABRS, ERC721ABaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator,
    string memory baseTokenURI
  ) ERC721ABRS(name, symbol, royaltyNumerator) ERC721ABaseUrl(baseTokenURI) {}

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABRS) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
