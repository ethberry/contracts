// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./ERC721ABCR.sol";

contract ERC721ABCRS is ERC721ABCR, ERC721URIStorage {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABCR(name, symbol, cap, royaltyNumerator) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721ABCR) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    _setTokenURI(tokenId, _tokenURI);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721ABCR) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721ABCR) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
