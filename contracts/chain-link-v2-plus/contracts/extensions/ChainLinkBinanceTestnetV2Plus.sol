// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2Plus.sol";

abstract contract ChainLinkBinanceTestnetV2Plus is ChainLinkBaseV2Plus {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0xDA3b641D438362C440Ac5458c57e00a712b66700), // vrfCoordinatorV2 Binance testnet
      0x8596b430971ac45bdf6088665b9ad8e8630c9d5049ab54b14dff711bee7c0e26, // key hash 50 gwei
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
