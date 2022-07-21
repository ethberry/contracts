// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

import "./ERC20ACBC.sol";

contract ERC20ACBCS is ERC20ACBC, ERC20Snapshot {
  bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");

  constructor(
    string memory name,
    string memory symbol,
    uint256 cap
  ) ERC20ACBC(name, symbol, cap) {
    _setupRole(SNAPSHOT_ROLE, _msgSender());
  }

  function snapshot() public onlyRole(SNAPSHOT_ROLE) {
    _snapshot();
  }

  function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20ACBC) {
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
