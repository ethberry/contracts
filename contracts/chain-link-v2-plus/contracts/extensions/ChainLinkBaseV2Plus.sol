// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { VRFConsumerBaseV2Plus } from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import { IVRFCoordinatorV2Plus } from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import { VRFV2PlusClient } from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

abstract contract ChainLinkBaseV2Plus is AccessControl, VRFConsumerBaseV2Plus {
  bytes32 internal immutable _keyHash;
  uint16 internal immutable _requestConfirmations;
  uint32 internal immutable _callbackGasLimit;
  uint32 internal immutable _numWords;
  IVRFCoordinatorV2Plus immutable COORDINATOR;
  uint256 internal _subId;

  error InvalidSubscription();
  event VrfSubscriptionSet(uint256 subId);

  constructor(
    address vrf,
    bytes32 keyHash,
    uint16 requestConfirmations,
    uint32 callbackGasLimit,
    uint32 numWords
  ) VRFConsumerBaseV2Plus(vrf) {
    COORDINATOR = IVRFCoordinatorV2Plus(vrf);
    _keyHash = keyHash;
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
  function setSubscriptionId(uint256 subId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (subId == 0) {
      revert InvalidSubscription();
    }

    _subId = subId;
    emit VrfSubscriptionSet(_subId);
  }
}
