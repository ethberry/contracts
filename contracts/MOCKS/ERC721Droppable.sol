// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721/ERC721Dropbox.sol";
import "../ERC721/preset/ERC721ACB.sol";

contract ERC721DroppableMock is ERC721Dropbox, ERC721ACB {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721ACB(name, symbol, baseTokenURI) ERC721Dropbox(name) {}

  function _safeMint(address to, uint256 tokenId) internal override(ERC721, ERC721Dropbox) {
    super._safeMint(to, tokenId);
  }
}
