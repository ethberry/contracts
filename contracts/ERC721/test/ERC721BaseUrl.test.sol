// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721BaseUrl.sol";
import "../preset/ERC721ACBR.sol";

contract ERC721BaseUrlTest is ERC721ACBR, ERC721BaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator,
    string memory baseTokenURI
  ) ERC721ACBR(name, symbol, royaltyNumerator) ERC721BaseUrl(baseTokenURI) {}

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setBaseURI(baseTokenURI);
  }
}
