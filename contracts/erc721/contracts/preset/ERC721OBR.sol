// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Royalty } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

import { ERC721OB } from "./ERC721OB.sol";
import { ERC721ORoyalty } from "../extensions/ERC721ORoyalty.sol";

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
