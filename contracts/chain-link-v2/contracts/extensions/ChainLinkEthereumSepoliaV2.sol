// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2 } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkEthereumSepoliaV2 is ChainLinkBaseV2 {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625), // vrfCoordinatorV2 Ethereum Sepolia
      0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c, // keyHash 750 gwei
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
