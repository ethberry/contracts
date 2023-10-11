// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC721} from  "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {ERC721AB} from "./ERC721AB.sol";
import {ERC721ARoyalty} from "../extensions/ERC721ARoyalty.sol";

contract ERC721ABR is ERC721AB, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721AB(name, symbol) ERC721ARoyalty(royaltyNumerator) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721AB, ERC721ARoyalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721) returns (address) {
    return super._update(to, tokenId, auth);
  }
}
