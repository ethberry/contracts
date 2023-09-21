// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";

import "./ChainLinkBase.sol";

abstract contract ChainLinkBinanceTestnet is ChainLinkBase {
  constructor()
    ChainLinkBase(
      address(0xa555fC018435bef5A13C6c6870a9d4C11DEC329C), // vrfCoordinator
      address(0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06), // LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}
