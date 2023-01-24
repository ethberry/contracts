// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC4907.sol";

import "./ERC721ABERS.sol";

contract ERC721ABERSU is ERC721ABERS, ERC4907 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABERS(name, symbol, royaltyNumerator) {}

  function _isApprovedOrOwner(address owner, uint256 tokenId) internal view override(ERC721, ERC4907) returns (bool) {
    return super._isApprovedOrOwner(owner, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721ABERS, ERC4907) returns (bool) {
    return ERC721ABERS.supportsInterface(interfaceId) || ERC4907.supportsInterface(interfaceId);
  }
}
