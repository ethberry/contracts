// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {ERC721ABaseUrl} from "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import {ERC721GeneralizedCollection, IERC721GeneralizedCollection} from "@gemunion/contracts-erc721/contracts/extensions/ERC721GeneralizedCollection.sol";
import {MINTER_ROLE} from "@gemunion/contracts-utils/contracts/roles.sol";
import {TEMPLATE_ID} from "@gemunion/contracts-utils/contracts/attributes.sol";

import {ERC721ABER} from "../preset/ERC721ABER.sol";

contract ERC721MetaData is ERC721ABER, ERC721GeneralizedCollection {
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
