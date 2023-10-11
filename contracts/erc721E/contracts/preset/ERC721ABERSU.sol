// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC721} from  "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {ERC4907} from "@gemunion/contracts-erc721/contracts/extensions/ERC4907.sol";

import {ERC721ABERS} from "./ERC721ABERS.sol";

contract ERC721ABERSU is ERC721ABERS, ERC4907 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABERS(name, symbol, royaltyNumerator) {}

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721ABERS) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721ABERS, ERC4907) returns (bool) {
    return ERC721ABERS.supportsInterface(interfaceId) || ERC4907.supportsInterface(interfaceId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721ABERS, ERC4907) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721ABERS) {
    super._increaseBalance(account, amount);
  }
}
