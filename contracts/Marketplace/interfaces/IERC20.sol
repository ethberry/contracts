// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IERC20 {
  function mint(
    address to,
    uint256 amount
  ) external;
}
