// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Consecutive.sol";

import "./ERC721ABR.sol";

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
  ) internal virtual override(ERC721, ERC721ABR) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }

  function _mint(address to, uint256 tokenId) internal virtual override(ERC721, ERC721Consecutive) {
    super._mint(to, tokenId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721ABR) {
    super._burn(tokenId);
  }

  function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721Consecutive) returns (address) {
    return super._ownerOf(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721ABR, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
