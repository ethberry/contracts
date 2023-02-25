// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "./ChainLinkBase.sol";

abstract contract ChainLinkGoerli is ChainLinkBase {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBase(
      address(0x199316A5ab4103f8d3e79DFd5A83a9C397694cB4), // vrfCoordinator
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // keyHash
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
