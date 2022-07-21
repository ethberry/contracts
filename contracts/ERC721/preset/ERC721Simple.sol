// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC721ACBER.sol";
import "../ERC721ACBaseUrl.sol";
import "../../utils/GeneralizedCollection.sol";

contract ERC721Simple is ERC721ACBER, ERC721ACBaseUrl, GeneralizedCollection {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBER(name, symbol, royalty) ERC721ACBaseUrl(baseTokenURI) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721ACBER)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  receive() external payable {
    revert();
  }
}
