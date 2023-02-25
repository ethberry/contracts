// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "./ChainLinkBase.sol";

abstract contract ChainLinkBinance is ChainLinkBase {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBase(
      address(0xc587d9053cd1118f25F645F9E08BB98c9712A4EE), // vrfCoordinator BNB mainnet
      0x17cd473250a9a479dc7f234c64332ed4bc8af9e8ded7556aa6e66d83da49f470, // key hash 1000 gwei
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
//LINK_ADDR=0x404460C6A5EdE2D891e8297795264fDe62ADBB75
