// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2Plus.sol";

abstract contract ChainLinkEthereumSepoliaV2Plus is ChainLinkBaseV2Plus {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B), // vrfCoordinatorV2 Ethereum Sepolia
      0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae, // keyHash 100 gwai
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
