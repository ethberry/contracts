// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "./ERC721OB.sol";
import "../extensions/ERC721ORoyalty.sol";

contract ERC721OBR is ERC721OB, ERC721ORoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721OB(name, symbol) ERC721ORoyalty(royaltyNumerator) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Royalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
