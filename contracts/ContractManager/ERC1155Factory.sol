// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC1155Factory is AbstractFactory {
  address[] private _erc1155_tokens;

  event ERC1155Deployed(address token, string baseTokenURI);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deployERC1155Token(bytes calldata bytecode, string memory baseTokenURI)
    external
    onlyRole(DEFAULT_ADMIN_ROLE)
    returns (address addr)
  {
    addr = deploy(bytecode, abi.encode(baseTokenURI));
    _erc1155_tokens.push(addr);
    emit ERC1155Deployed(addr, baseTokenURI);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = keccak256("MINTER_ROLE");
    roles[1] = 0x00;

    fixPermissions(addr, roles);
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
