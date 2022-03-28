// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

abstract contract ERC721CappedEnumerable is ERC721Enumerable {
  uint256 internal _cap;

  constructor(uint256 cap_) {
    require(cap_ > 0, "ERC721CappedEnumerable: cap is 0");
    _cap = cap_;
  }

  /**
   * @dev Returns the cap on the token's total supply.
   */
  function cap() public view virtual returns (uint256) {
    return _cap;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721Enumerable) {
    require(super.totalSupply() <= _cap, "ERC721CappedEnumerable: cap exceeded");
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
