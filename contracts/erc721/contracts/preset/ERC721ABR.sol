// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721AB.sol";
import "../extensions/ERC721ARoyalty.sol";

contract ERC721ABR is ERC721AB, ERC721ARoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royaltyNumerator
  ) ERC721AB(name, symbol)  ERC721ARoyalty(royaltyNumerator){
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721AB, ERC721ARoyalty)
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
