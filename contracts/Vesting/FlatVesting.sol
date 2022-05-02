// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract FlatVesting is VestingWallet {
  constructor(
    address beneficiaryAddress,
    uint64 startTimestamp,
    uint64 durationSeconds
  ) VestingWallet(beneficiaryAddress, startTimestamp, durationSeconds) {}

  function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view override returns (uint256) {
    if (timestamp > start() + duration()) {
      return totalAllocation;
    } else {
      return 0;
    }
  }
}
