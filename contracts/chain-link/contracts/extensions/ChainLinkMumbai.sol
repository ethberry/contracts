// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {VRFConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";

import {ChainLinkBase} from "./ChainLinkBase.sol";

abstract contract ChainLinkMumbai is ChainLinkBase {
  constructor()
    ChainLinkBase(
      address(0x8C7382F9D8f56b33781fE506E897a4F1e2d17255), // vrfCoordinator
      address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB), // LINK token
      0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4, // system hash
      0.0001 ether // fee
    )
  {}
}
