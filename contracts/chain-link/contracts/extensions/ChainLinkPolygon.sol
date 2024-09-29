// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBase } from "./ChainLinkBase.sol";

abstract contract ChainLinkPolygon is ChainLinkBase {
  constructor()
    ChainLinkBase(
      address(0x3d2341ADb2D31f1c5530cDC622016af293177AE0), // vrfCoordinator
      address(0xb0897686c545045aFc77CF20eC7A532E3120E0F1), // LINK token
      0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da, // system hash
      0.0001 ether // fee
    )
  {}
}
