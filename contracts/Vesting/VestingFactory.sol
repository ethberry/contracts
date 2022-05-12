// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./FlatVesting.sol";
import "./LinearVesting.sol";

abstract contract VestingFactory is Context {
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

  function _deployVesting(
    string calldata template,
    address token,
    uint256 amount,
    address beneficiary,
    uint64 startTimestamp,
    uint64 duration
  ) internal returns (address addr) {
    if (keccak256(bytes(template)) == keccak256(bytes("FLAT"))) {
      addr = address(new FlatVesting(beneficiary, startTimestamp, duration));
    } else if (keccak256(bytes(template)) == keccak256(bytes("LINEAR"))) {
      addr = address(new LinearVesting(beneficiary, startTimestamp, duration));
    } else {
      revert("VestingFactory: unknown template");
    }

    _vesting.push(addr);

    emit VestingDeployed(addr, template, token, amount, beneficiary, startTimestamp, duration);

    if (token != address(0)) {
      SafeERC20.safeTransferFrom(IERC20(token), _msgSender(), addr, amount);
    } else {
      (bool success, ) = addr.call{ value: amount }("");
      require(success, "VestingFactory: can't transfer to vesting contract");
    }
  }

  function allVesting() public view returns (address[] memory) {
    return _vesting;
  }
}
