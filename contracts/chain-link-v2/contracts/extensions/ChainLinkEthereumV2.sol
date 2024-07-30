// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2 } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkEthereumV2 is ChainLinkBaseV2 {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0x271682DEB8C4E0901D1a1550aD2e64D568E69909), // vrfCoordinatorV2 Ethereum
      0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef, // keyHash 200 gwai
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
