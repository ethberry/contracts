// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ARoyalty.sol";

import "./ERC721ABCE.sol";

contract ERC721ABCER is ERC721ABCE, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABCE(name, symbol, cap) ERC721ARoyalty(royaltyNumerator) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721ABCE, ERC721ARoyalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721, ERC721ABCE) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
