// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { BlackList } from "../extension/BlackList.sol";

contract BlackListTest is BlackList {
  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function testMe() external view onlyNotBlackListed returns (bool) {
    return true;
  }
}
