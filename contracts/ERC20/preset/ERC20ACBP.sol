// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "./ERC20ACB.sol";

contract ERC20ACBP is ERC20ACB, ERC20Permit {
  constructor(string memory name, string memory symbol) ERC20ACB(name, symbol) ERC20Permit(name) {}

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
