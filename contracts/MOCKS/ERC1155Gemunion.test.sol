// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC1155/ERC1155Gemunion.sol";

contract ERC1155GemunionTest is ERC1155Gemunion {
  constructor(
    string memory baseTokenURI
  ) ERC1155Gemunion(baseTokenURI) {}
}
