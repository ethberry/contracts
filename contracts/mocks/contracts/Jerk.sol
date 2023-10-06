// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

contract Jerk {
  /**
   * @dev Rejects any incoming ETH transfers to this contract address
   */
  receive() external payable {
    revert();
  }
}
