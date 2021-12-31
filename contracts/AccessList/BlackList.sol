// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";


abstract contract BlackList is AccessControl {
  error BlackListError(address account);

  mapping(address => bool) blackList;

  event Blacklisted(address indexed addr);
  event UnBlacklisted(address indexed addr);

  function blacklist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
    blackList[addr] = true;
    emit Blacklisted(addr);
  }

  function unBlacklist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
    blackList[addr] = false;
    emit UnBlacklisted(addr);
  }

  function isBlacklisted(address addr) public view returns (bool) {
    return blackList[addr];
  }

  function _blacklist(address account) internal view {
    if (isBlacklisted(account)) {
      revert BlackListError(account);
    }
  }

  modifier onlyNotBlackListed() {
    _blacklist(_msgSender());
    _;
  }
}