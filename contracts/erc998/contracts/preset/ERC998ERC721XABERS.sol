// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts-erc721/contracts/preset/ERC721ABERS.sol";

import "../extensions/ERC998ERC721Enumerable.sol";

contract ERC998ERC721XABERS is ERC721ABERS, ERC998ERC721Enumerable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty
  ) ERC721ABERS(name, symbol, royalty) {}

  function ownerOf(uint256 tokenId) public view virtual override(ERC721, ERC998ERC721) returns (address) {
    return super.ownerOf(tokenId);
  }

  function isApprovedForAll(address owner, address operator)
    public
    view
    virtual
    override(ERC721, ERC998ERC721)
    returns (bool)
  {
    return super.isApprovedForAll(owner, operator);
  }

  function approve(address to, uint256 _tokenId) public virtual override(ERC721, ERC998ERC721) {
    ERC998ERC721.approve(to, _tokenId);
  }

  function getApproved(uint256 _tokenId) public view virtual override(ERC721, ERC998ERC721) returns (address) {
    return ERC998ERC721.getApproved(_tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721ABERS, ERC998ERC721) {
    ERC998ERC721._beforeTokenTransfer(from, to, tokenId);
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721ABERS, ERC998ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
