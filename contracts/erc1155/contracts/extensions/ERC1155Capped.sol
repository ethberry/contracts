// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

abstract contract ERC1155Capped is ERC1155Supply {
  error ERC1155ExceededCap(uint256 increasedSupply, uint256 cap, uint256 tokenId);

  function _update(address from, address to, uint256[] memory ids, uint256[] memory amounts) internal virtual override {
    if (from == address(0)) {
      for (uint256 i = 0; i < ids.length;) {
        if (totalSupply(ids[i]) != 0) {
          revert ERC1155ExceededCap(totalSupply(ids[i]) + amounts[i], totalSupply(ids[i]), ids[i]);
        }
        unchecked {
          i++;
        }
      }
    }

    super._update(from, to, ids, amounts);
  }
}
