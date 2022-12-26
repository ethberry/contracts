// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IWhiteList.sol";

abstract contract WhiteList is IWhiteList, AccessControl {
  mapping(address => bool) whiteList;

  function whitelist(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    whiteList[account] = true;
    emit Whitelisted(account);
  }

  function unWhitelist(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    whiteList[account] = false;
    emit UnWhitelisted(account);
  }

  function isWhitelisted(address account) external view returns (bool) {
    return whiteList[account];
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
