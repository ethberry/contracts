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

contract StakingERC20ERC20 is AccessControl, Pausable {
  using Address for address;
  using Counters for Counters.Counter;

  uint256 private _periodInSeconds;
  uint256 private _rewardPerPeriod;
  IERC20 private _acceptedToken;
  IERC20 private _rewardToken;
  Counters.Counter private _auctionIdCounter;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  struct StakingData {
    uint256 _owner;
    uint256 _amount;
    uint256 _startTimestamp;
    uint256 _periodInSeconds;
    uint256 _rewardPerPeriod;
  }

  mapping(uint256 => StakingData) private _stakes;

  event StakingStart(
    uint256 stakingId,
    address owner,
    uint256 amount,
    uint256 startTimestamp,
    uint256 periodInSeconds,
    uint256 rewardPerPeriod
  );
  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp, uint256 reward);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp);

  constructor(
    address acceptedToken,
    address rewardToken,
    uint256 periodInSeconds,
    uint256 rewardPerPeriod
  ) {
    require(acceptedToken.isContract(), "Staking: The accepted token address must be a deployed contract");
    _acceptedToken = IERC20(acceptedToken);
    require(rewardToken.isContract(), "Staking: The reward token address must be a deployed contract");
    _rewardToken = IERC20(rewardToken);

    require(periodInSeconds != 0, "Staking: period length should greater than zero");
    _periodInSeconds = periodInSeconds;
    _rewardPerPeriod = rewardPerPeriod;

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function stake(uint256 amount) public virtual whenNotPaused {
    require(stake._amount != 0, "Staking: amount should be greater than zero");

    _acceptedToken.transferFrom(_msgSender(), address(this), amount);

    uint256 stakeId = _auctionIdCounter.current();
    _auctionIdCounter.increment();

    _stakes[stakeId] = StakingData(_msgSender(), amount, block.timestamp, _periodInSeconds, _rewardPerPeriod);
    emit AuctionStart(_msgSender(), amount, block.timestamp, _periodInSeconds, _rewardPerPeriod);
  }

  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 periodInSeconds
  ) internal pure virtual returns (uint256) {
    return (finishTimestamp - startTimestamp) % periodInSeconds;
  }

  function receiveReward(
    uint256 stakingId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual whenNotPaused {
    StakingData storage stake = _stakes[auctionId];
    require(stake._owner != address(0), "Staking: wrong staking id");
    require(stake._owner != _msgSender(), "Staking: not an owner");
    require(stake._amount != 0, "Staking: deposit withdrawn");

    uint256 reward = _calculateReward();

    uint256 multiplier;
    if (withdrawDeposit || breakLastPeriod) {
      multiplier = _calculateRewardMultiplier(stake._startTimestamp, block.timestamp, stake._periodInSeconds);
    } else {
      multiplier = _calculateRewardMultiplier(
        stake._startTimestamp,
        stake._startTimestamp +
          (((block.timestamp - stake._startTimestamp) % stake._periodInSeconds) * stake._periodInSeconds),
        stake._periodInSeconds
      );
    }

    if (withdrawDeposit) {
      _acceptedToken.transfer(stake._owner, stake._amount);
      stake._amount = 0;
    } else {
      stake._startTimestamp = block.timestamp;
      // stake._startTimestamp = stake._startTimestamp + stake._periodInSeconds * stake._periodInSeconds
    }

    if (multiplier != 0) {
      _rewardToken.transfer(stake._owner, stake._rewardPerPeriod * multiplier);
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
