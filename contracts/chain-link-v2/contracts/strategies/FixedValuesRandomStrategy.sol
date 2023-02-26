// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

contract FixedValuesRandomStrategy {
  uint8[] _dispersion;

  function _setDispersion(uint8[] memory dispersion) internal {
    require(dispersion.length == 100, "ERC721Random: dispersion must have 100 elements");
    _dispersion = dispersion;
  }

  function _getDispersion(uint256 randomness) internal view virtual returns (uint8) {
    require(_dispersion.length == 100, "ERC721Random: dispersion is not set");
    uint256 percent = (randomness % 100) + 1;
    return _dispersion[percent];
  }
}
