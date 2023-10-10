// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import "./ERC20AB.sol";

contract ERC20ABT is ERC20AB, ERC20Permit {
  constructor(string memory name, string memory symbol) ERC20AB(name, symbol) ERC20Permit(name) {}

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
