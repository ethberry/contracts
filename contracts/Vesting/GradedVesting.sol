// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract GradedVesting is VestingWallet {
  constructor(
    address account,
    uint64 startTimestamp,
    uint64 duration
  ) VestingWallet(account, startTimestamp, duration) {}

  function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view override returns (uint256) {
    uint256 period = duration() / 4;
    if (timestamp > start() + duration()) {
      return totalAllocation;
    } else if (timestamp > start() + period * 3) {
      return (totalAllocation * 60) / 100;
    } else if (timestamp > start() + period * 2) {
      return (totalAllocation * 30) / 100;
    } else if (timestamp > start() + period) {
      return (totalAllocation * 10) / 100;
    } else {
      return 0;
    }
  }
}
