// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract ERC721GemunionReceiverTest is ERC721, ERC721Holder {
  constructor(
    string memory name,
    string memory symbol
  ) ERC721(name, symbol) {
  }
}