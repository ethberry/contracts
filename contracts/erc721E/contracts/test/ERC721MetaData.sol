// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";

import "../extensions/ERC721AMetaDataGetter.sol";
import "../preset/ERC721ABER.sol";

contract ERC721MetaDataTest is ERC721ABER, ERC721AMetaDataGetter {
  uint256 private _nextTokenId;

  constructor(string memory name, string memory symbol, uint96 royalty) ERC721ABER(name, symbol, royalty) {}

  function mint(address to) public override onlyRole(MINTER_ROLE) {
    _upsertRecordField(_nextTokenId, TEMPLATE_ID, 42);
    super.mint(to);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override {
    super._increaseBalance(account, amount);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABER) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
