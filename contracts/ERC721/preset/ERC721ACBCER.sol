// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721ACBCE.sol";
import "../ERC721ACRoyalty.sol";

contract ERC721ACBCER is ERC721ACBCE, ERC721ACRoyalty {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721ACBCE(name, symbol, cap) ERC721ACRoyalty(royaltyNumerator) {
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721ACBCE, ERC721ACRoyalty)
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
  ) internal virtual override(ERC721, ERC721ACBCE) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
