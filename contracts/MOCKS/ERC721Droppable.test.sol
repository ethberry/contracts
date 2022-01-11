// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC721/ERC721Droppable.sol";

contract ERC721DroppableTest is ERC721Droppable {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721Droppable(name, symbol, baseTokenURI, 20) {}
}
