// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2Plus.sol";

abstract contract ChainLinkEthereumV2Plus is ChainLinkBaseV2Plus {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0xD7f86b4b8Cae7D942340FF628F82735b7a20893a), // vrfCoordinatorV2 Ethereum
      0x8077df514608a09f83e4e8d300645594e5d7234665448ba83f51a50f842bd3d9, // keyHash 200 gwei
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
