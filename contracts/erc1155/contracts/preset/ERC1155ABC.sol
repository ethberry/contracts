// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import { ERC1155AB } from "./ERC1155AB.sol";
import { ERC1155Capped } from "../extensions/ERC1155Capped.sol";

contract ERC1155ABC is ERC1155AB, ERC1155Capped {
  constructor(string memory uri) ERC1155AB(uri) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155AB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _update(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts
  ) internal virtual override(ERC1155, ERC1155Capped) {
    super._update(from, to, ids, amounts);
  }
}
