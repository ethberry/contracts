// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC2981 } from "@openzeppelin/contracts/token/common/ERC2981.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IERC1155Royalty } from "../interfaces/IERC1155Royalty.sol";

abstract contract ERC1155ORoyalty is Ownable, IERC1155Royalty, ERC2981 {
  constructor(uint96 royaltyNumerator) {
    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function setDefaultRoyalty(address royaltyReceiver, uint96 royaltyNumerator) public virtual override onlyOwner {
    super._setDefaultRoyalty(royaltyReceiver, royaltyNumerator);
    emit DefaultRoyaltyInfo(royaltyReceiver, royaltyNumerator);
  }

  function setTokenRoyalty(
    uint256 tokenId,
    address royaltyReceiver,
    uint96 royaltyNumerator
  ) public virtual override onlyOwner {
    super._setTokenRoyalty(tokenId, royaltyReceiver, royaltyNumerator);
    emit TokenRoyaltyInfo(tokenId, royaltyReceiver, royaltyNumerator);
  }
}
