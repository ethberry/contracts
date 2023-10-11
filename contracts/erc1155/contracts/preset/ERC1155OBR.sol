// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";

import {ERC1155OB} from "./ERC1155OB.sol";
import {ERC1155ORoyalty} from "../extensions/ERC1155ORoyalty.sol";

contract ERC1155OBR is ERC1155OB, ERC1155ORoyalty {
  constructor(uint96 royaltyNumerator, string memory uri) ERC1155OB(uri) ERC1155ORoyalty(royaltyNumerator) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
