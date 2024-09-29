// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC20, IERC20, IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import { ERC20ABC } from "./ERC20ABC.sol";

contract ERC20ABCT is ERC20ABC, ERC20Permit {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20ABC(name, symbol, cap) ERC20Permit(name) {}

  function _update(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20ABC) {
    super._update(from, to, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC20).interfaceId ||
      interfaceId == type(IERC20Metadata).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
