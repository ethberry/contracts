// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2Plus.sol";

abstract contract ChainLinkGemunionBesuV2Plus is ChainLinkBaseV2Plus {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0x86C86939c631D53c6D812625bD6Ccd5Bf5BEb774), // besu ethberry vrfCoordinatorV2Plus
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // keyHash
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
