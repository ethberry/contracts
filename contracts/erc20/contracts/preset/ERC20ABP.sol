// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

import { PAUSER_ROLE } from "@gemunion/contracts-utils/contracts/roles.sol";

import { ERC20AB } from "./ERC20AB.sol";

contract ERC20ABP is ERC20AB, ERC20Pausable {
  constructor(string memory name, string memory symbol) ERC20AB(name, symbol) {
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function _update(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Pausable) {
    super._update(from, to, amount);
  }
}
