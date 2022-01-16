// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC20/ERC20GemunionPausable.sol";

contract ERC20GemunionPausableTest is ERC20GemunionPausable {
  constructor(string memory name, string memory symbol) ERC20GemunionPausable(name, symbol, 100) {}
}
