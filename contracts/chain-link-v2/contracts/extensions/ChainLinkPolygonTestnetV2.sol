// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2 } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkPolygonTestnetV2 is ChainLinkBaseV2 {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed), // vrfCoordinator Polygon testnet
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f, // key hash 500 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
//LINK_ADDR=0x326C977E6efc84E512bB9C30f76E30c160eD06FB
