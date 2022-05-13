// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

import "../ERC1155/templates/ERC1155Simple.sol";

contract ERC1155Factory is AccessControl {
  address[] private _erc1155_tokens;

  event ERC1155Deployed(address token, string template, string baseTokenURI);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployERC1155Token(
    string calldata template,
    string memory baseTokenURI
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    IAccessControl token;

    if (keccak256(bytes(template)) == keccak256(bytes("SIMPLE"))) {
      token = new ERC1155Simple(baseTokenURI);
      addr = address(token);
    } else {
      revert("ERC1155Factory: unknown template");
    }

    _erc1155_tokens.push(addr);

    emit ERC1155Deployed(addr, template, baseTokenURI);

    token.grantRole(0x00, _msgSender());
    token.renounceRole(0x00, address(this));
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
