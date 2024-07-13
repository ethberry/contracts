// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

interface ERC20Burnable {

  function burn(uint256 value) external;

  function burnFrom(address account, uint256 value) external;
}
