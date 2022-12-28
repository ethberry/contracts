// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../preset/ERC721ABCRS.sol";
import "../extensions/ERC721Dropbox.sol";

contract ERC721DropboxTest is ERC721ABCRS, ERC721Dropbox {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABCRS(name, symbol, cap, royaltyNumerator) ERC721Dropbox(name) {}

  function _safeMint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Dropbox) {
    return super._safeMint(account, tokenId);
  }

  function redeem(address account, uint256 tokenId, address signer, bytes calldata signature) public virtual {
    _checkRole(MINTER_ROLE, signer);
    _redeem(account, tokenId, signer, signature);
  }
}
