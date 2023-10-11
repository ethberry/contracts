// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20, IERC20, IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {DEFAULT_ADMIN_ROLE, MINTER_ROLE} from "@gemunion/contracts-utils/contracts/roles.sol";

contract ERC20ABNon1363 is AccessControl, ERC20Burnable {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC20).interfaceId ||
      interfaceId == type(IERC20Metadata).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
