// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "../ERC721/ChainLink/strategies/FormulaRandomStrategy.sol";

contract ERC721FormulaRandomStrategy is AccessControl, FormulaRandomStrategy {
  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function getDispersion(uint256 randomness) external pure returns (uint8) {
    return _getDispersion(randomness);
  }
}
