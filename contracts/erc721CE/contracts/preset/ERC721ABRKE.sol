// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { ERC721ABRK } from "@ethberry/contracts-erc721c/contracts/preset/ERC721ABRK.sol";

contract ERC721ABRKE is ERC721ABRK, ERC721Enumerable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABRK(name, symbol, royaltyNumerator) {
    _mintConsecutive2(address(0), 0);
  }

  function _mintConsecutive2(address, uint96) internal virtual override returns (uint96) {
    return super._mintConsecutive(_msgSender(), _maxBatchSize());
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721ABRK, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721ABRK) returns (address) {
    return super._ownerOf(tokenId);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721ABRK, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
