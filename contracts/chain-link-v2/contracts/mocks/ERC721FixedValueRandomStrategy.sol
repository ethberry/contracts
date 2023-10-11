// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {FixedValuesRandomStrategy} from "../strategies/FixedValuesRandomStrategy.sol";

contract ERC721FixedValueRandomStrategy is AccessControl, FixedValuesRandomStrategy {
  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function setDispersion(uint8[] memory dispersion) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setDispersion(dispersion);
  }

  function getDispersion(uint256 randomness) external view returns (uint8) {
    return _getDispersion(randomness);
  }
}
