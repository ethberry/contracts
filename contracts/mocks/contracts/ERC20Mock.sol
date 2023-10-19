// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {DEFAULT_ADMIN_ROLE, MINTER_ROLE} from "@gemunion/contracts-utils/contracts/roles.sol";

contract ERC20Mock is AccessControl, ERC20, ERC20Capped {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20(name, symbol) ERC20Capped(cap) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    _mint(to, amount);
  }

  function _update(
    address from,
    address to,
    uint256 amount
  ) internal virtual override (ERC20, ERC20Capped) {
    super._update(from, to, amount);
  }
}
