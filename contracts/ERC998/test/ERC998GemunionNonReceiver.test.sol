// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC998GemunionNonReceiverTest is ERC721 {
  constructor(
    string memory name,
    string memory symbol
  ) ERC721(name, symbol) {
  }
}