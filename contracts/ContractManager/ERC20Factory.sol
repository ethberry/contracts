// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC20Factory is AbstractFactory {
  address[] private _erc20_tokens;

  event ERC20Deployed(address token, string name, string symbol, uint256 cap);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployERC20Token(
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    uint256 cap
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    addr = deploy(bytecode, abi.encode(name, symbol, cap));
    _erc20_tokens.push(addr);
    emit ERC20Deployed(addr, name, symbol, cap);

    bytes32[] memory roles = new bytes32[](3);
    roles[0] = keccak256("MINTER_ROLE");
    roles[1] = keccak256("SNAPSHOT_ROLE");
    roles[2] = 0x00;

    fixPermissions(addr, roles);
  }

  function allERC20Tokens() external view returns (address[] memory) {
    return _erc20_tokens;
  }
}
