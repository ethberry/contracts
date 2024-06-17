// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2 } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkPolygonAmoyV2 is ChainLinkBaseV2 {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0x7E10652Cb79Ba97bC1D0F38a1e8FaD8464a8a908), // vrfCoordinator Polygon Amoy
      0x3f631d5ec60a0ce16203bcd6aff7ffbc423e22e452786288e172d467354304c8, // key hash 500 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
