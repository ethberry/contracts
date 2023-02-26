// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "../strategies/FormulaRandomStrategy.sol";

contract ERC721FormulaRandomStrategy is AccessControl, FormulaRandomStrategy {
  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function getDispersion(uint256 randomness) external pure returns (uint8) {
    return _getDispersion(randomness);
  }
}
