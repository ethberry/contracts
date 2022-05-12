// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract LinearVesting is VestingWallet {
  constructor(
    address beneficiary,
    uint64 startTimestamp,
    uint64 duration
  ) VestingWallet(beneficiary, startTimestamp, duration) {}
}
