// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721Capped is ERC721 {
  uint256 internal _cap;
  uint256[] private _allTokens;

  constructor(uint256 cap_) {
    require(cap_ > 0, "ERC721Capped: cap is 0");
    _cap = cap_;
  }

  /**
   * @dev Returns the cap on the token's total supply.
   */
  function cap() public view virtual returns (uint256) {
    return _cap;
  }

  function totalSupply() public view virtual returns (uint256) {
    return _allTokens.length;
  }

  function _mint(address account, uint256 tokenId) internal virtual override {
    require(totalSupply() + 1 <= cap(), "ERC721Capped: cap exceeded");
    _allTokens.push(tokenId);
    super._mint(account, tokenId);
  }

  function _safeMint(address account, uint256 tokenId) internal virtual override {
    require(totalSupply() + 1 <= cap(), "ERC721Capped: cap exceeded");
    _allTokens.push(tokenId);
    super._safeMint(account, tokenId);
  }
}
