// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { ERC721ABRS } from "./ERC721ABRS.sol";
import { ERC4907 } from "../extensions/ERC4907.sol";

contract ERC721ABRSU is ERC721ABRS, ERC4907 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABRS(name, symbol, royaltyNumerator) {}

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721ABRS) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC4907, ERC721ABRS) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC4907, ERC721ABRS) returns (bool) {
    return ERC4907.supportsInterface(interfaceId) || ERC721ABRS.supportsInterface(interfaceId);
  }
}
