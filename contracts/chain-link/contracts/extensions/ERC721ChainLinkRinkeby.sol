// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLink.sol";

abstract contract ERC721ChainLinkRinkeby is ERC721ChainLink {
  constructor()
    ERC721ChainLink(
      address(0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B), // vrfCoordinator
      address(0x01BE23585060835E02B77ef475b0Cc51aA1e0709), // LINK token
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // system hash
      0.1 ether // fee
    )
  {}
}
