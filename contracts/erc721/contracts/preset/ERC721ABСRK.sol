// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Consecutive.sol";

import "./ERC721ABCR.sol";

contract ERC721ABCRK is ERC721ABCR, ERC721Consecutive {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABCR(name, symbol, cap, royaltyNumerator) {
    _mintConsecutive2(address(0), 0);
  }

  function _mintConsecutive2(address, uint96) internal virtual {
    _mintConsecutive(_msgSender(), _maxBatchSize());
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721, ERC721Consecutive) {
    super._afterTokenTransfer(from, to, firstTokenId, batchSize);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721, ERC721ABCR) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }

  function _mint(address to, uint256 tokenId) internal virtual override(ERC721, ERC721Consecutive) {
    super._mint(to, tokenId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721ABCR) {
    super._burn(tokenId);
  }

  function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721Consecutive) returns (address) {
    return super._ownerOf(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721ABCR, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
