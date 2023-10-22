// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {FormulaRandomStrategy} from "../strategies/FormulaRandomStrategy.sol";

contract FormulaRandomStrategyTest is AccessControl, FormulaRandomStrategy {
  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function getDispersion(uint256 randomness) external pure returns (uint8) {
    return _getDispersion(randomness);
  }
}
