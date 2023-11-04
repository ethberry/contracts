// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2 } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkBinanceTestnetV2 is ChainLinkBaseV2 {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0x6A2AAd07396B36Fe02a22b33cf443582f682c82f), // vrfCoordinatorV2 Binance testnet
      0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314, // key hash 50 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
//LINK_ADDR=0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06
