// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Consecutive } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Consecutive.sol";

import { ERC721ABCR } from "@ethberry/contracts-erc721/contracts/preset/ERC721ABCR.sol";

contract ERC721ABCRK is ERC721ABCR, ERC721Consecutive {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABCR(name, symbol, cap, royaltyNumerator) {
    _mintConsecutive2(address(0), 0);
  }

  function _mintConsecutive2(address, uint96) internal virtual returns (uint96) {
    return super._mintConsecutive(_msgSender(), _maxBatchSize());
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721ABCR, ERC721Consecutive) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721ABCR) {
    super._increaseBalance(account, amount);
  }

  function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721Consecutive) returns (address) {
    return super._ownerOf(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721ABCR) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
