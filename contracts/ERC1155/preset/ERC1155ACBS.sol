// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC1155ACBS is AccessControl, ERC1155Burnable, ERC1155Supply {
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

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override(ERC1155, ERC1155Supply) {

    /*
    * It is necessary that OpenZeppelin ERC1155Supply does not return with the error
    * "Arithmetic operation underflowed or overflowed outside of an unchecked block"
    */
    if (to == address(0)) {
      for (uint256 i = 0; i < ids.length; ++i) {
        uint256 fromBalance = balanceOf(from, ids[i]);
        require(fromBalance >= amounts[i], "ERC1155: burn amount exceeds balance");
      }
    }
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
