// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+permission@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract ERC20PolygonParent is ERC20, AccessControl {
  bytes32 public constant PREDICATE_ROLE = keccak256("PREDICATE_ROLE");

  constructor() {
    _setupRole(PREDICATE_ROLE, _msgSender());
  }

  /**
   * @param to user for whom tokens are being minted
   * @param amount amount of token to mint
   */
  function mint(address to, uint256 amount) public virtual onlyRole(PREDICATE_ROLE) {
    _mint(to, amount);
  }
}
