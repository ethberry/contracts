// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkBinanceV2 is ChainLinkBaseV2Plus {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0xc587d9053cd1118f25F645F9E08BB98c9712A4EE), // vrfCoordinatorV2 Binance mainnet
      0x17cd473250a9a479dc7f234c64332ed4bc8af9e8ded7556aa6e66d83da49f470, // key hash 1000 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
