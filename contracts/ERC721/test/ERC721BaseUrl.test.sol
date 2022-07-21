// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721ACBaseUrl.sol";
import "../preset/ERC721ACBR.sol";

contract ERC721BaseUrlTest is ERC721ACBR, ERC721ACBaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator,
    string memory baseTokenURI
  ) ERC721ACBR(name, symbol, royaltyNumerator) ERC721ACBaseUrl(baseTokenURI) {}

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721ACBR)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
