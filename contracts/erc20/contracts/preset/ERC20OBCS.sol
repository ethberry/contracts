// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

import "./ERC20OBC.sol";

contract ERC20OBCS is ERC20OBC, ERC20Snapshot {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20OBC(name, symbol, cap) {}

  function snapshot() public onlyOwner {
    _snapshot();
  }

  function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20OBC) {
    super._mint(account, amount);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override(ERC20, ERC20Snapshot) {
    super._beforeTokenTransfer(from, to, amount);
  }
}
