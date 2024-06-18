// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBaseV2Plus } from "./ChainLinkBaseV2.sol";

abstract contract ChainLinkTelosTestV2 is ChainLinkBaseV2Plus {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2Plus(
      address(0x33040c29f57F126B90d9528A5Ee659D7a604B835), // vrfCoordinatorV2 Telos testnet
      0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314, // key hash 50 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
//LINK_ADDR=0x6eab1c5259173c4fea5667b4aad6529f4fc3176e
