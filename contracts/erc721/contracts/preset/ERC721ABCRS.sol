// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import { ERC721ABCR } from "./ERC721ABCR.sol";

contract ERC721ABCRS is ERC721ABCR, ERC721URIStorage {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABCR(name, symbol, cap, royaltyNumerator) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721ABCR, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    _setTokenURI(tokenId, _tokenURI);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721ABCR) {
    super._increaseBalance(account, amount);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721ABCR) returns (address) {
    return super._update(to, tokenId, auth);
  }
}
