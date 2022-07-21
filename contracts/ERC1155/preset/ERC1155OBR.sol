// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC1155OB.sol";
import "../ERC1155ORoyalty.sol";

contract ERC1155OBR is ERC1155OB, ERC1155ORoyalty {
  constructor(string memory uri, uint96 royaltyNumerator) ERC1155OB(uri) {
    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
