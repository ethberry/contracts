// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "../preset/ERC721ABRS.sol";
import "../extensions/ERC721ABaseUrl.sol";

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
