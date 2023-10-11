// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {IERC1155Royalty} from "../interfaces/IERC1155Royalty.sol";

abstract contract ERC1155ARoyalty is AccessControl, IERC1155Royalty, ERC2981 {
  constructor(uint96 royaltyNumerator) {
    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function setDefaultRoyalty(
    address royaltyReceiver,
    uint96 royaltyNumerator
  ) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
    super._setDefaultRoyalty(royaltyReceiver, royaltyNumerator);
    emit DefaultRoyaltyInfo(royaltyReceiver, royaltyNumerator);
  }

  function setTokenRoyalty(
    uint256 tokenId,
    address royaltyReceiver,
    uint96 royaltyNumerator
  ) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
    super._setTokenRoyalty(tokenId, royaltyReceiver, royaltyNumerator);
    emit TokenRoyaltyInfo(tokenId, royaltyReceiver, royaltyNumerator);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
