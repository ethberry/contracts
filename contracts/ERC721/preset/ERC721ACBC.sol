// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721ACB.sol";
import "../ERC721Capped.sol";

contract ERC721ACBC is ERC721ACB, ERC721Capped {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap
  ) ERC721ACB(name, symbol) ERC721Capped(cap) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721ACB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Capped) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
