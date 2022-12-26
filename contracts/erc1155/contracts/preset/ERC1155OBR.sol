// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC1155OB.sol";
import "../extensions/ERC1155ORoyalty.sol";

contract ERC1155OBR is ERC1155OB, ERC1155ORoyalty {
  constructor(uint96 royaltyNumerator, string memory uri) ERC1155OB(uri) ERC1155ORoyalty(royaltyNumerator) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
