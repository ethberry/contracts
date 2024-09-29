// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721Capped is ERC721 {
  uint256 internal immutable _cap;
  uint256 private _allTokens;

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

  function totalSupply() public view virtual returns (uint256) {
    return _allTokens;
  }

  function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    address from = _ownerOf(tokenId);

    // mint
    if (from == address(0)) {
      if (++_allTokens > cap()) {
        revert ERC721ExceededCap(_allTokens, cap());
      }
    }

    // burn
    if (to == address(0)) {
      --_allTokens;
    }

    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 value) internal virtual override {
    if (totalSupply() + value > cap()) {
      revert ERC721ExceededCap(totalSupply() + value, cap());
    }
    _allTokens += value;

    super._increaseBalance(account, value);
  }
}
