// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;


interface IBlackList {
  error BlackListError(address account);

  event Blacklisted(address indexed account);
  event UnBlacklisted(address indexed account);

  function blacklist(address addr) external;

  function unBlacklist(address addr) external;

  function isBlacklisted(address addr) external view returns (bool);
}
