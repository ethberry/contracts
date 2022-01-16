// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721/ERC721GemunionPausable.sol";

contract ERC721GemunionPausableTest is ERC721GemunionPausable {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721GemunionPausable(name, symbol, baseTokenURI, 2) {}
}
