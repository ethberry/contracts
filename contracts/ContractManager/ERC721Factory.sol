// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

import "../ERC721/templates/ERC721Random.sol";
import "../ERC721/templates/ERC721Simple.sol";

contract ERC721Factory is AccessControl {
  address[] private _erc721_tokens;

  event ERC721Deployed(
    address token,
    string template,
    string name,
    string symbol,
    string baseTokenURI,
    uint96 royaltyNumerator
  );

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployERC721Token(
    string calldata template,
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    IAccessControl token;

    if (keccak256(bytes(template)) == keccak256(bytes("SIMPLE"))) {
      token = new ERC721Simple(name, symbol, baseTokenURI, royaltyNumerator);
      addr = address(token);
    } else if (keccak256(bytes(template)) == keccak256(bytes("RANDOM"))) {
      token = new ERC721Random(name, symbol, baseTokenURI, royaltyNumerator);
      addr = address(token);
    } else {
      revert("ERC721Factory: unknown template");
    }

    _erc721_tokens.push(addr);

    emit ERC721Deployed(addr, template, name, symbol, baseTokenURI, royaltyNumerator);

    token.grantRole(0x00, _msgSender());
    token.renounceRole(0x00, address(this));
  }

  function allERC721Tokens() external view returns (address[] memory) {
    return _erc721_tokens;
  }
}
