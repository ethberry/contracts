// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721ACBaseUrl.sol";
import "../preset/ERC721ACBRS.sol";

contract ERC721BaseUrlTest is ERC721ACBRS, ERC721ACBaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator,
    string memory baseTokenURI
  ) ERC721ACBRS(name, symbol, royaltyNumerator) ERC721ACBaseUrl(baseTokenURI) {}

  function _baseURI() internal view virtual override(ERC721, ERC721ACBaseUrl) returns (string memory) {
    return super._baseURI();
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721ACBRS)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
