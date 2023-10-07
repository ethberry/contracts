// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-utils/contracts/roles.sol";

contract ERC1155AB is AccessControl, ERC1155Burnable {
  constructor(string memory uri) ERC1155(uri) {
    address account = _msgSender();

    _grantRole(DEFAULT_ADMIN_ROLE, account);
    _grantRole(MINTER_ROLE, account);
  }

  function mint(address to, uint256 id, uint256 amount, bytes memory data) public virtual onlyRole(MINTER_ROLE) {
    _mint(to, id, amount, data);
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public virtual onlyRole(MINTER_ROLE) {
    _mintBatch(to, ids, amounts, data);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
