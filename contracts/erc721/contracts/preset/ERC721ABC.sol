// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./ERC721AB.sol";
import "../extensions/ERC721Capped.sol";

contract ERC721ABC is ERC721AB, ERC721Capped {
  constructor(string memory name, string memory symbol, uint256 cap) ERC721AB(name, symbol) ERC721Capped(cap) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721AB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721, ERC721Capped) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
