// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721/ERC721Dropbox.sol";
import "../ERC721/ERC721Gemunion.sol";

contract ERC721DropboxTest is ERC721Dropbox, ERC721Gemunion {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721Gemunion(name, symbol, baseTokenURI, 20) ERC721Dropbox(name) {}

  function redeem(
    address account,
    uint256 tokenId,
    address signer,
    bytes calldata signature
  ) public virtual {
    require(hasRole(MINTER_ROLE, signer), "ERC721Dropbox: signer has no `MINTER_ROLE`");
    _redeem(account, tokenId, signer, signature);
  }

  function _safeMint(address account, uint256 tokenId) internal virtual override(ERC721Dropbox, ERC721Gemunion) {
    super._safeMint(account, tokenId);
  }
}
