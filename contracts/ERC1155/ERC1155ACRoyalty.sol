// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IERC1155Royalty.sol";

abstract contract ERC1155ACRoyalty is AccessControl, IERC1155Royalty, ERC2981 {
  constructor(uint96 royaltyNumerator) {
    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function setDefaultRoyalty(address royaltyReceiver, uint96 royaltyNumerator)
    public
    virtual
    override
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
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

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC2981)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
