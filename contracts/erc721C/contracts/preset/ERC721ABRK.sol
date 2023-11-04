// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Consecutive } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Consecutive.sol";

import { ERC721ABR } from "@gemunion/contracts-erc721/contracts/preset/ERC721ABR.sol";

contract ERC721ABRK is ERC721ABR, ERC721Consecutive {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABR(name, symbol, royaltyNumerator) {
    _mintConsecutive2(address(0), 0);
  }

  function _mintConsecutive2(address, uint96) internal virtual returns (uint96) {
    return super._mintConsecutive(_msgSender(), _maxBatchSize());
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721ABR, ERC721Consecutive) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721Consecutive) returns (address) {
    return super._ownerOf(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721ABR) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
