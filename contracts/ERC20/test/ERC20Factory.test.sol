// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "../ERC20Factory.sol";

contract ERC20FactoryTest is AccessControl, ERC20Factory {
  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployERC20Token(
    string calldata template,
    string memory name,
    string memory symbol,
    uint256 cap
  ) public onlyRole(DEFAULT_ADMIN_ROLE) returns (address) {
    return _deployERC20Token(template, name, symbol, cap);
  }
}
