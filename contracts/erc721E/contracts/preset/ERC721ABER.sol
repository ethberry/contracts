// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721ARoyalty } from "@ethberry/contracts-erc721/contracts/extensions/ERC721ARoyalty.sol";

import { ERC721ABE } from "./ERC721ABE.sol";

contract ERC721ABER is ERC721ABE, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABE(name, symbol) ERC721ARoyalty(royaltyNumerator) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721ABE, ERC721ARoyalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721ABE) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721ABE) {
    super._increaseBalance(account, amount);
  }
}
