// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721/ERC721Dropbox.sol";
import "../ERC721/preset/ERC721ACB.sol";

contract ERC721DropboxMock is ERC721Dropbox, ERC721ACB {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721ACB(name, symbol, baseTokenURI) ERC721Dropbox(name) {}

  function redeem(
    address account,
    uint256 tokenId,
    address signer,
    bytes calldata signature
  ) public virtual {
    _checkRole(MINTER_ROLE, signer);
    _redeem(account, tokenId, signer, signature);
  }

  function _safeMint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Dropbox) {
    super._safeMint(account, tokenId);
  }
}
