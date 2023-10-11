// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {ChainLinkBaseV2} from"./ChainLinkBaseV2.sol";

abstract contract ChainLinkGemunionV2 is ChainLinkBaseV2 {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0x86C86939c631D53c6D812625bD6Ccd5Bf5BEb774), // vrfCoordinator
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // keyHash
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
