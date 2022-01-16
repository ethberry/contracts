// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC1155/ERC1155GemunionPausable.sol";

contract ERC1155GemunionPausableTest is ERC1155GemunionPausable {
  constructor(string memory baseTokenURI) ERC1155GemunionPausable(baseTokenURI) {}
}
