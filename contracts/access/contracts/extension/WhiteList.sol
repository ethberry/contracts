// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { IWhiteList } from "./interfaces/IWhiteList.sol";

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
    return _isWhitelisted(account);
  }

  function _isWhitelisted(address account) internal view returns (bool) {
    return whiteList[account];
  }

  modifier onlyWhiteListed() {
    if (!_isWhitelisted(_msgSender())) {
      revert WhiteListError(_msgSender());
    }
    _;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IWhiteList).interfaceId || super.supportsInterface(interfaceId);
  }
}
