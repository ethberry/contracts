// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721ACB.sol";
import "../ERC721ACRoyalty.sol";

contract ERC721ACBR is ERC721ACB, ERC721ACRoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ACB(name, symbol) {
    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721ACB, ERC721ACRoyalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
