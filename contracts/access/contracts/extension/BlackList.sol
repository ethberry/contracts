// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {IBlackList} from "./interfaces/IBlackList.sol";

abstract contract BlackList is IBlackList, AccessControl {
  mapping(address => bool) blackList;

  function blacklist(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    blackList[account] = true;
    emit Blacklisted(account);
  }

  function unBlacklist(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    blackList[account] = false;
    emit UnBlacklisted(account);
  }

  function isBlacklisted(address account) external view returns (bool) {
    return _isBlacklisted(account);
  }

  function _isBlacklisted(address account) internal view returns (bool) {
    return blackList[account];
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

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IBlackList).interfaceId || super.supportsInterface(interfaceId);
  }
}
