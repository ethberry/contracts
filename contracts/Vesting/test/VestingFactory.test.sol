// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "../VestingFactory.sol";

contract VestingFactoryTest is AccessControl, VestingFactory {
  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployVesting(
    string calldata template,
    address token,
    uint256 amount,
    address beneficiary,
    uint64 startTimestamp,
    uint64 duration
  ) public payable onlyRole(DEFAULT_ADMIN_ROLE) returns (address) {
    uint256 _amount = token == address(0) ? msg.value : amount;
    require(_amount > 0, "ContractManager: vesting amount must be greater than zero");

    return _deployVesting(template, token, _amount, beneficiary, startTimestamp, duration);
  }
}
