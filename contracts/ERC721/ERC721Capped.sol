// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract ERC721Capped is Context, ERC721Enumerable {
  uint256 internal _cap;

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

  function _mint(address to, uint256 tokenId) internal virtual override {
    require(totalSupply() + 1 <= cap(), "ERC20Capped: cap exceeded");
    super._mint(to, tokenId);
  }

  function _safeMint(address to, uint256 tokenId) internal virtual override {
    require(totalSupply() + 1 <= cap(), "ERC20Capped: cap exceeded");
    super._safeMint(to, tokenId);
  }
}
