// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { WhiteList } from "../extension/WhiteList.sol";

contract WhiteListTest is WhiteList {
  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function testMe() external view onlyWhiteListed returns (bool success) {
    return true;
  }
}
