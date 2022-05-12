// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

import "./preset/ERC20ACBCS.sol";
import "./preset/ERC20ACBCSP.sol";

abstract contract ERC20Factory is Context {
  address[] private _erc20_tokens;

  event ERC20Deployed(address token, string template, string name, string symbol, uint256 cap);

  function _deployERC20Token(
    string calldata template,
    string memory name,
    string memory symbol,
    uint256 cap
  ) internal returns (address addr) {
    IAccessControl token;

    if (keccak256(bytes(template)) == keccak256(bytes("SIMPLE"))) {
      token = new ERC20ACBCS(name, symbol, cap);
      addr = address(token);
    } else if (keccak256(bytes(template)) == keccak256(bytes("PERMIT"))) {
      token = new ERC20ACBCSP(name, symbol, cap);
      addr = address(token);
    } else {
      revert("ERC20Factory: unknown template");
    }

    _erc20_tokens.push(addr);

    emit ERC20Deployed(addr, template, name, symbol, cap);

    token.grantRole(0x00, _msgSender());
    token.renounceRole(0x00, address(this));
  }

  function allERC20Tokens() public view returns (address[] memory) {
    return _erc20_tokens;
  }
}
