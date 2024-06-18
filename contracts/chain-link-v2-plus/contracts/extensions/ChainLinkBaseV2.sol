// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { VRFConsumerBaseV2Plus } from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import { IVRFCoordinatorV2Plus } from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import { VRFV2PlusClient } from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

abstract contract ChainLinkBaseV2Plus is AccessControl, VRFConsumerBaseV2Plus {
  bytes32 internal _keyHash;
  uint64 internal _subId;
  uint16 internal _requestConfirmations;
  uint32 internal _callbackGasLimit;
  uint32 internal _numWords;
  IVRFCoordinatorV2Plus COORDINATOR;

  error InvalidSubscription();
  event VrfSubscriptionSet(uint64 subId);

  constructor(
    address vrf,
    bytes32 keyHash,
    uint64 subId,
    uint16 requestConfirmations,
    uint32 callbackGasLimit,
    uint32 numWords
  ) VRFConsumerBaseV2Plus(vrf) {
    COORDINATOR = IVRFCoordinatorV2Plus(vrf);
    _keyHash = keyHash;
    _subId = subId;
    _requestConfirmations = requestConfirmations;
    _callbackGasLimit = callbackGasLimit;
    _numWords = numWords;
  }

  function getRandomNumber() internal virtual returns (uint256 requestId) {
    if (_subId == 0) {
      revert InvalidSubscription();
    }

    requestId = COORDINATOR.requestRandomWords(
      VRFV2PlusClient.RandomWordsRequest({
        keyHash: _keyHash,
        subId: _subId,
        requestConfirmations: _requestConfirmations,
        callbackGasLimit: _callbackGasLimit,
        numWords: _numWords,
        // Set nativePayment to true to pay for VRF requests with Sepolia ETH instead of LINK
        extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({ nativePayment: false }))
      })
    );

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
