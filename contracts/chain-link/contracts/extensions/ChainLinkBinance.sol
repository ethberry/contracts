// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ChainLinkBase } from "./ChainLinkBase.sol";

abstract contract ChainLinkBinance is ChainLinkBase {
  constructor()
    ChainLinkBase(
      address(0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31), // vrfCoordinator
      address(0x404460C6A5EdE2D891e8297795264fDe62ADBB75), // LINK token
      0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c, // system hash
      0.2 ether // fee
    )
  {}
}
