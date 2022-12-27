// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../preset/ERC721ABRS.sol";
import "../extensions/ERC721Dropbox.sol";

contract ERC721DropboxTest is ERC721ABRS, ERC721Dropbox {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABRS(name, symbol, royaltyNumerator) ERC721Dropbox(name) {}

  function _safeMint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Dropbox) {
    return super._safeMint(account, tokenId);
  }
}
