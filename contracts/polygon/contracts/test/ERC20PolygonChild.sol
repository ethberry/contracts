// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "../ERC20/ERC20PolygonChild.sol";

contract ERC20PolygonChildTest is ERC20, AccessControl, ERC20PolygonChild {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }
}
