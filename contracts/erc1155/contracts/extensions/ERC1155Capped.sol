// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

abstract contract ERC1155Capped is ERC1155Supply {
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override {
    if (from == address(0)) {
      for (uint256 i = 0; i < ids.length; i++) {
        require(totalSupply(ids[i]) == 0, "ERC1155Capped: subsequent mint not allowed");
      }
    }

    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
