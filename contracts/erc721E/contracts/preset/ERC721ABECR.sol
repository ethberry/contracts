// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ARoyalty.sol";

import "./ERC721ABEC.sol";

contract ERC721ABECR is ERC721ABEC, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ABEC(name, symbol, cap) ERC721ARoyalty(royaltyNumerator) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721ABEC, ERC721ARoyalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721ABEC) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721ABEC) {
    super._increaseBalance(account, amount);
  }
}
