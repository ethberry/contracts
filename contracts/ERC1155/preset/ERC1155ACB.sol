// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC1155ACB is AccessControl, ERC1155Burnable {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor(string memory uri) ERC1155(uri) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
  }

  function mint(
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public virtual onlyRole(MINTER_ROLE) {
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
