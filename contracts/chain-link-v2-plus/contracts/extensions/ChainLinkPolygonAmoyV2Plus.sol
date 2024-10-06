// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2Plus.sol";

abstract contract ChainLinkPolygonAmoyV2Plus is ChainLinkBaseV2Plus {
  constructor(
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2), // vrf
      0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899, // keyHash 500 gwei
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
