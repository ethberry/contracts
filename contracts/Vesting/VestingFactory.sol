// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./FlatVesting.sol";

contract VestingFactory is AccessControl, Pausable {
  using SafeERC20 for IERC20;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  address[] private _vesting;

  event FlatVestingCreated(
    address vesting,
    address owner,
    address token,
    uint256 amount,
    address beneficiary,
    uint64 startTimestamp,
    uint64 durationSeconds
  );

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function createFlatVesting(
    address token,
    uint256 amount,
    address beneficiary,
    uint64 startTimestamp,
    uint64 durationSeconds
  ) public whenNotPaused returns (address vesting) {
    FlatVesting instance = new FlatVesting(beneficiary, startTimestamp, durationSeconds);

    vesting = address(instance);
    _vesting.push(vesting);

    emit FlatVestingCreated(vesting, _msgSender(), token, amount, beneficiary, startTimestamp, durationSeconds);

    SafeERC20.safeTransferFrom(IERC20(token), _msgSender(), vesting, amount);
  }

  function allVesting() public view returns (address[] memory) {
    return _vesting;
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
