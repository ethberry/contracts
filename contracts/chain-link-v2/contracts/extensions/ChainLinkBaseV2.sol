// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error InvalidSubscription();

abstract contract ChainLinkBaseV2 is VRFConsumerBaseV2 {
  bytes32 internal _keyHash;
  uint64 internal _subId;
  uint16 internal _minReqConfs;
  uint32 internal _callbackGasLimit;
  uint32 internal _numWords;
  VRFCoordinatorV2Interface COORDINATOR;

  constructor(
    address vrf,
    bytes32 keyHash,
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  ) VRFConsumerBaseV2(vrf) {
    COORDINATOR = VRFCoordinatorV2Interface(vrf);
    _keyHash = keyHash;
    _subId = subId;
    _minReqConfs = minReqConfs;
    _callbackGasLimit = callbackGasLimit;
    _numWords = numWords;
  }

  function setSubscriptionId(uint64) external virtual {
  }

  function getRandomNumber() internal virtual returns (uint256 requestId) {
    if (_subId == 0) revert InvalidSubscription();
    requestId = COORDINATOR.requestRandomWords(_keyHash, _subId, _minReqConfs, _callbackGasLimit, _numWords);
    return requestId;
  }
}
