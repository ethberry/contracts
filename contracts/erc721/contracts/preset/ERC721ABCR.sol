// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { ERC721ABC } from "./ERC721ABC.sol";
import { ERC721ARoyalty } from "../extensions/ERC721ARoyalty.sol";

contract ERC721ABCR is ERC721ABC, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABC(name, symbol, cap) ERC721ARoyalty(royaltyNumerator) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721ABC, ERC721ARoyalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721ABC) {
    super._increaseBalance(account, amount);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721ABC) returns (address) {
    return super._update(to, tokenId, auth);
  }
}
