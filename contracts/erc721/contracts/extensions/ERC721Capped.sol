// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721Capped is ERC721 {
  uint256 internal _cap;
  uint256 private _allTokens;

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
    return _allTokens;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override {
    if (from == address(0)) {
      require(totalSupply() < cap(), "ERC721Capped: cap exceeded");
    }
    _allTokens += batchSize;
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
