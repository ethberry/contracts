// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

import "./ERC20ABCS.sol";

contract ERC20ABCSP is ERC20ABCS, ERC20Pausable {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(string memory name, string memory symbol, uint256 cap) ERC20ABCS(name, symbol, cap) {
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20ABCS) {
    super._mint(account, amount);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal
    virtual
    override(ERC20ABCS, ERC20Pausable)
  {
    super._beforeTokenTransfer(from, to, amount);
  }
}
