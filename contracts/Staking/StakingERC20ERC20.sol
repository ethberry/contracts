// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IERC20Mintable.sol";

contract StakingERC20ERC20 is AccessControl, Pausable {
  using Address for address;
  using Counters for Counters.Counter;

  uint256[] private _periods; // seconds
  uint256[] private _amounts; // wei
  uint256[] private _rewards; // wei

  IERC20 private _acceptedToken;
  IERC20Mintable private _rewardToken;

  Counters.Counter private _stakeIdCounter;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  struct StakingData {
    address _owner;
    uint256 _startTimestamp;
    uint256 _period;
    uint256 _amount;
    uint256 _reward;
  }

  mapping(uint256 => StakingData) private _stakes;

  event StakingStart(
    uint256 stakingId,
    address owner,
    uint256 startTimestamp,
    uint256 periods,
    uint256 amounts,
    uint256 rewards
  );
  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp, uint256 reward);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp);

  constructor(
    address acceptedToken,
    address rewardToken,
    uint256[] memory periods,
    uint256[] memory amounts,
    uint256[] memory rewards
  ) {
    require(acceptedToken.isContract(), "Staking: The accepted token address must be a deployed contract");
    _acceptedToken = IERC20(acceptedToken);
    require(rewardToken.isContract(), "Staking: The reward token address must be a deployed contract");
    _rewardToken = IERC20Mintable(rewardToken);

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());

    setNewRules(periods, amounts, rewards);
  }

  function setNewRules(
    uint256[] memory periods,
    uint256[] memory amounts,
    uint256[] memory rewards
  ) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    require(periods.length != amounts.length && amounts.length != rewards.length, "Staking: length doesn't match");

    for (uint256 i; i < periods.length; i++) {
      require(periods[i] != 0, "Staking: period length should greater than zero");
      require(amounts[i] != 0, "Staking: amount amount should greater than zero");
      require(rewards[i] != 0, "Staking: reward amount should greater than zero");
    }

    _periods = periods;
    _amounts = amounts;
    _rewards = rewards;
  }

  function deposit(uint256 level) public virtual whenNotPaused {
    require(level < _periods.length, "Staking: level doesn't exist");

    _acceptedToken.transferFrom(_msgSender(), address(this), _amounts[level]);

    uint256 stakeId = _stakeIdCounter.current();
    _stakeIdCounter.increment();

    _stakes[stakeId] = StakingData(_msgSender(), block.timestamp, _periods[level], _amounts[level], _rewards[level]);
    emit StakingStart(stakeId, _msgSender(), block.timestamp, _periods[level], _amounts[level], _rewards[level]);
  }

  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 period
  ) internal pure virtual returns (uint256) {
    return (finishTimestamp - startTimestamp) % period;
  }

  function receiveReward(
    uint256 stakingId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual whenNotPaused {
    StakingData storage stake = _stakes[stakingId];
    require(stake._owner != address(0), "Staking: wrong staking id");
    require(stake._owner != _msgSender(), "Staking: not an owner");
    require(stake._amount != 0, "Staking: deposit withdrawn");

    uint256 multiplier;
    if (withdrawDeposit || breakLastPeriod) {
      multiplier = _calculateRewardMultiplier(stake._startTimestamp, block.timestamp, stake._period);
    } else {
      multiplier = _calculateRewardMultiplier(
        stake._startTimestamp,
        stake._startTimestamp +
          (((block.timestamp - stake._startTimestamp) % stake._period) * stake._period),
        stake._period
      );
    }

    if (withdrawDeposit) {
      uint256 amount = stake._amount;
      stake._amount = 0;
      _acceptedToken.transfer(stake._owner, amount);
    } else {
      stake._startTimestamp = block.timestamp;
      // stake._startTimestamp = stake._startTimestamp + stake._period * stake._period
    }

    if (multiplier != 0) {
      _rewardToken.mint(stake._owner, stake._reward * multiplier);
    }
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
