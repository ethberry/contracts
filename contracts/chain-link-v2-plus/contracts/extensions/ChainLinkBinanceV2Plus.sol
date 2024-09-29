// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2Plus.sol";

abstract contract ChainLinkBinanceV2Plus is ChainLinkBaseV2Plus {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0xd691f04bc0C9a24Edb78af9E005Cf85768F694C9), // vrfCoordinatorV2 Binance mainnet
      0x130dba50ad435d4ecc214aad0d5820474137bd68e7e77724144f27c3c377d3d4, // keyHash 200 gwei
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
