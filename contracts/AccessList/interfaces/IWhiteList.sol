// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

interface IWhiteList {
  error WhiteListError(address account);

  event Whitelisted(address indexed account);
  event UnWhitelisted(address indexed account);

  function whitelist(address addr) external;

  function unWhitelist(address addr) external;

  function isWhitelisted(address addr) external view returns (bool);
}
