// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "./ERC20ABCS.sol";

contract ERC20ABCST is ERC20ABCS, ERC20Permit {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20ABCS(name, symbol, cap) ERC20Permit(name) {}

  function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20ABCS) {
    super._mint(account, amount);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20ABCS) {
    super._beforeTokenTransfer(from, to, amount);
  }

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
