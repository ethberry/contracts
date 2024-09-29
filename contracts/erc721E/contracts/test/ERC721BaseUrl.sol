// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721ABaseUrl } from "@ethberry/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { ERC721ABERS } from "../preset/ERC721ABERS.sol";

contract ERC721BaseUrlTest is ERC721ABERS, ERC721ABaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator,
    string memory baseTokenURI
  ) ERC721ABERS(name, symbol, royaltyNumerator) ERC721ABaseUrl(baseTokenURI) {}

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override {
    super._increaseBalance(account, amount);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABERS) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
