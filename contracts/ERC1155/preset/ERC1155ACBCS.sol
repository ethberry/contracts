// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC1155Capped.sol";
import "./ERC1155ACB.sol";

contract ERC1155ACBCS is ERC1155ACB, ERC1155Capped {
  constructor(string memory uri) ERC1155ACB(uri) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155ACB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override(ERC1155, ERC1155Capped) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
