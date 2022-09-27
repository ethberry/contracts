// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721ABE.sol";
import "../extensions/ERC721ARoyalty.sol";

contract ERC721ABER is ERC721ABE, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721ABE(name, symbol) ERC721ARoyalty(royaltyNumerator) {
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721ABE, ERC721ARoyalty)
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
  ) internal virtual override(ERC721, ERC721ABE) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}