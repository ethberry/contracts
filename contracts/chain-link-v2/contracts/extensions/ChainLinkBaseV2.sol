// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { VRFConsumerBaseV2 } from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import { VRFCoordinatorV2Interface } from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

abstract contract ChainLinkBaseV2 is AccessControl, VRFConsumerBaseV2 {
  bytes32 internal immutable _keyHash;
  uint16 internal immutable _minReqConfs;
  uint32 internal immutable _callbackGasLimit;
  uint32 internal immutable _numWords;
  VRFCoordinatorV2Interface immutable COORDINATOR;
  uint64 internal _subId;

  error InvalidSubscription();
  event VrfSubscriptionSet(uint64 subId);

  constructor(
    address vrf,
    bytes32 keyHash,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  ) VRFConsumerBaseV2(vrf) {
    COORDINATOR = VRFCoordinatorV2Interface(vrf);
    _keyHash = keyHash;
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
