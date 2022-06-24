// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IWhiteList.sol";

abstract contract WhiteList is IWhiteList, AccessControl {
  mapping(address => bool) whiteList;

  function whitelist(address addr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    whiteList[addr] = true;
    emit Whitelisted(addr);
  }

  function unWhitelist(address addr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    whiteList[addr] = false;
    emit UnWhitelisted(addr);
  }

  function isWhitelisted(address addr) external view returns (bool) {
    return whiteList[addr];
  }

  function _whitelist(address account) internal view {
    if (!this.isWhitelisted(account)) {
      revert WhiteListError(account);
    }
  }

  modifier onlyWhiteListed() {
    _whitelist(_msgSender());
    _;
  }
}
