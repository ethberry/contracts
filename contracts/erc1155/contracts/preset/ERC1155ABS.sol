// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

import { ERC1155AB } from "./ERC1155AB.sol";

contract ERC1155ABS is ERC1155AB, ERC1155Supply {
  constructor(string memory uri) ERC1155AB(uri) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155AB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _update(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts
  ) internal virtual override(ERC1155, ERC1155Supply) {
    super._update(from, to, ids, amounts);
  }
}
