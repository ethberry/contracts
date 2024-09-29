// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155, ERC1155Burnable } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@ethberry/contracts-utils/contracts/roles.sol";

contract ERC1155Mock is AccessControl, ERC1155Burnable {
  constructor(string memory uri) ERC1155(uri) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());
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
