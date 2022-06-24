// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IBlackList.sol";

abstract contract BlackList is IBlackList, AccessControl {
  mapping(address => bool) blackList;

  function blacklist(address addr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    blackList[addr] = true;
    emit Blacklisted(addr);
  }

  function unBlacklist(address addr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    blackList[addr] = false;
    emit UnBlacklisted(addr);
  }

  function isBlacklisted(address addr) external view returns (bool) {
    return blackList[addr];
  }

  function _blacklist(address account) internal view {
    if (this.isBlacklisted(account)) {
      revert BlackListError(account);
    }
  }

  modifier onlyNotBlackListed() {
    _blacklist(_msgSender());
    _;
  }
}
