// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

abstract contract ERC721CappedEnumerable is ERC721Enumerable {
  uint256 internal immutable _cap;

  error ERC721ExceededCap(uint256 increasedSupply, uint256 cap);

  error ERC721InvalidCap(uint256 cap);

  constructor(uint256 cap_) {
    if (cap_ == 0) {
      revert ERC721InvalidCap(0);
    }

    _cap = cap_;
  }

  /**
   * @dev Returns the cap on the token's total supply.
   */
  function cap() public view virtual returns (uint256) {
    return _cap;
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721Enumerable) returns (address) {
    address previousOwner = super._update(to, tokenId, auth);

    if (previousOwner == address(0) && super.totalSupply() > cap()) {
      revert ERC721ExceededCap(super.totalSupply(), cap());
    }

    return previousOwner;
  }
}
