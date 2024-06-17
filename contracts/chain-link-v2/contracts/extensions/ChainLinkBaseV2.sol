// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { VRFConsumerBaseV2 } from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import { VRFCoordinatorV2Interface } from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

abstract contract ChainLinkBaseV2 is AccessControl, VRFConsumerBaseV2 {
  bytes32 internal _keyHash;
  uint64 internal _subId;
  uint16 internal _minReqConfs;
  uint32 internal _callbackGasLimit;
  uint32 internal _numWords;
  VRFCoordinatorV2Interface COORDINATOR;

  error InvalidSubscription();
  event VrfSubscriptionSet(uint64 subId);

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

  function getRandomNumber() internal virtual returns (uint256 requestId) {
    if (_subId == 0) {
      revert InvalidSubscription();
    }

    requestId = COORDINATOR.requestRandomWords(_keyHash, _subId, _minReqConfs, _callbackGasLimit, _numWords);
    return requestId;
  }

  // OWNER MUST SET A VRF SUBSCRIPTION ID AFTER DEPLOY
  function setSubscriptionId(uint64 subId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (subId == 0) {
      revert InvalidSubscription();
    }
    _subId = subId;
    emit VrfSubscriptionSet(_subId);
  }
}
