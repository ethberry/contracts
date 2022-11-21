// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";

import "../preset/ERC721ABERS.sol";

contract ERC721BaseUrlTest is ERC721ABERS, ERC721ABaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator,
    string memory baseTokenURI
  ) ERC721ABERS(name, symbol, royaltyNumerator) ERC721ABaseUrl(baseTokenURI) {}

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABERS) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
