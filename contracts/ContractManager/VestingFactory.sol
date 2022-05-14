// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract VestingFactory is AbstractFactory {
  address[] private _vesting;

  event VestingDeployed(
    address addr,
    address beneficiary,
    uint64 startTimestamp, // in seconds
    uint64 duration // in seconds
  );

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployVesting(
    bytes calldata bytecode,
    address beneficiary,
    uint64 startTimestamp,
    uint64 duration
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    addr = deploy(bytecode, abi.encode(beneficiary, startTimestamp, duration));
    _vesting.push(addr);
    emit VestingDeployed(addr, beneficiary, startTimestamp, duration);
  }

  function allVesting() external view returns (address[] memory) {
    return _vesting;
  }
}
