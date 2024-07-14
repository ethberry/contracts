// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { ERC1363 } from "@gemunion/contracts-erc1363/contracts/extensions/ERC1363.sol";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-utils/contracts/roles.sol";

contract ERC1363Mock is AccessControl, ERC1363 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    _mint(to, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1363) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
