// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLink.sol";

abstract contract ERC721ChainLinkGoerli is ERC721ChainLink {
  constructor()
    ERC721ChainLink(
      address(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D), // vrfCoordinator
      address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB), // LINK token
      0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15, // system hash
      0.25 ether // fee
    )
  {}
}
