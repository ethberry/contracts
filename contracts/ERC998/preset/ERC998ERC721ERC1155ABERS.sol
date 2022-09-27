// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";

import "./ERC998ERC721ABERS.sol";
import "../extensions/ERC998ERC1155.sol";

contract ERC998ERC1155Simple is ERC998ERC721ABERS, ERC998ERC1155 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty
  ) ERC998ERC721ABERS(name, symbol, royalty) {}

  function ownerOf(uint256 tokenId)
    public
    view
    virtual
    override(ERC998ERC721ABERS, ERC998ERC1155)
    returns (address)
  {
    return super.ownerOf(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC998ERC721ABERS, ERC998ERC1155)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _ownerOrApproved(address sender, uint256 tokenId) internal view override(ERC998ERC721, ERC998Utils) {
     super._ownerOrApproved(sender, tokenId);
  }
}
