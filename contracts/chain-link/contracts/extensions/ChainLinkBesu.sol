// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ChainLinkBase.sol";

abstract contract ChainLinkBesu is ChainLinkBase {
  constructor()
    ChainLinkBase(
      address(0xEaAa2b3575b81f5DBE4cc59d6BA41A088C064647), // vrfCoordinator
      address(0x8BCaF30fed623A721aB6A2E9A9ed4f0b2F141Bfd), // LINK token
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // system hash
      0.01 ether // fee
    )
  {}
}
