// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ChainLinkBase.sol";

abstract contract ChainLinkMainnet is ChainLinkBase {
  constructor()
    ChainLinkBase(
      address(0xf0d54349aDdcf704F77AE15b96510dEA15cb7952), // vrfCoordinator
      address(0x514910771AF9Ca656af840dff83E8264EcF986CA), // LINK token
      0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445, // system hash
      2 ether // fee
    )
  {}
}
