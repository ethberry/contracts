// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

abstract contract ERC1155Capped is ERC1155Supply {
  function _update(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts
  ) internal virtual override {
    if (from == address(0)) {
      for (uint256 i = 0; i < ids.length; i++) {
        require(totalSupply(ids[i]) == 0, "ERC1155Capped: subsequent mint not allowed");
      }
    }

    super._update(from, to, ids, amounts);
  }
}
