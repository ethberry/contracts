// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

contract FixedValuesRandomStrategy {
  uint8[] _dispersion;

  error SequenceLength(uint256 length);

  error SequenceNotSet();

  function _setDispersion(uint8[] memory dispersion) internal {
    if (dispersion.length != 100) {
      revert SequenceLength(dispersion.length);
    }

    _dispersion = dispersion;
  }

  function _getDispersion(uint256 randomness) internal view virtual returns (uint8) {
    if (_dispersion.length != 100) {
      revert SequenceNotSet();
    }

    uint256 percent = (randomness % 100) + 1;
    return _dispersion[percent];
  }
}
