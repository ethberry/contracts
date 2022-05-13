// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../Vesting/FlatVesting.sol";
import "../Vesting/LinearVesting.sol";

contract VestingFactory is AccessControl {
  using SafeERC20 for IERC20;

  address[] private _vesting;

  event VestingDeployed(
    address vesting,
    string template,
    address token,
    uint256 amount,
    address beneficiary,
    uint64 startTimestamp, // in seconds
    uint64 duration // in seconds
  );

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
  ) external payable onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    uint256 _amount = token == address(0) ? msg.value : amount;
    require(_amount > 0, "VestingFactory: vesting amount must be greater than zero");

  if (keccak256(bytes(template)) == keccak256(bytes("FLAT"))) {
      addr = address(new FlatVesting(beneficiary, startTimestamp, duration));
    } else if (keccak256(bytes(template)) == keccak256(bytes("LINEAR"))) {
      addr = address(new LinearVesting(beneficiary, startTimestamp, duration));
    } else {
      revert("VestingFactory: unknown template");
    }

    _vesting.push(addr);

    emit VestingDeployed(addr, template, token, _amount, beneficiary, startTimestamp, duration);

    if (token != address(0)) {
      SafeERC20.safeTransferFrom(IERC20(token), _msgSender(), addr, amount);
    } else {
      (bool success, ) = addr.call{ value: amount }("");
      require(success, "VestingFactory: can't transfer to vesting contract");
    }
  }

  function allVesting() external view returns (address[] memory) {
    return _vesting;
  }
}
