// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

import "../interfaces/IERC721Royalty.sol";

abstract contract ERC721ARoyalty is AccessControl, IERC721Royalty, ERC721Royalty {
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
    override(AccessControl, ERC721Royalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
