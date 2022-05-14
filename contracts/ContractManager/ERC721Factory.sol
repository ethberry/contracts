// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC721Factory is AbstractFactory {
  address[] private _erc721_tokens;

  event ERC721Deployed(address addr, string name, string symbol, string baseTokenURI, uint96 royaltyNumerator);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployERC721Token(
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    addr = deploy(bytecode, abi.encode(name, symbol, baseTokenURI, royaltyNumerator));
    _erc721_tokens.push(addr);
    emit ERC721Deployed(addr, name, symbol, baseTokenURI, royaltyNumerator);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = keccak256("MINTER_ROLE");
    roles[1] = 0x00;

    fixPermissions(addr, roles);
  }

  function allERC721Tokens() external view returns (address[] memory) {
    return _erc721_tokens;
  }
}
