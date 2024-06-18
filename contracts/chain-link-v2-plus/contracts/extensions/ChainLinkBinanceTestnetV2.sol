// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkBinanceTestnetV2 is ChainLinkBaseV2Plus {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0x6A2AAd07396B36Fe02a22b33cf443582f682c82f), // vrfCoordinatorV2 Binance testnet
      0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314, // key hash 50 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
