// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../ERC721CappedEnumerable.sol";
import "../interfaces/IERC721Royalty.sol";

contract ERC721ACBER is AccessControl, ERC721Burnable, ERC721Enumerable, IERC721Royalty, ERC721Royalty {
  using Counters for Counters.Counter;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  Counters.Counter internal _tokenIdTracker;

  string internal _baseTokenURI;

  event DefaultRoyaltyInfo(address royaltyReceiver, uint96 royalty);
  event TokenRoyaltyInfo(uint256 tokenId, address royaltyReceiver, uint96 royalty);

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royalty
  ) ERC721(name, symbol) {
    _baseTokenURI = baseTokenURI;

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());

    _setDefaultRoyalty(_msgSender(), royalty);
  }

  function mint(address to) public virtual onlyRole(MINTER_ROLE) {
    // We cannot just use balanceOf to create the new tokenId because tokens
    // can be burned (destroyed), so we need a separate counter.
    _mint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function safeMint(address to) public virtual onlyRole(MINTER_ROLE) {
    // We cannot just use balanceOf to create the new tokenId because tokens
    // can be burned (destroyed), so we need a separate counter.
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function setDefaultRoyalty(address royaltyReceiver, uint96 royalty)
    public
    virtual
    override
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    super._setDefaultRoyalty(royaltyReceiver, royalty);
    emit DefaultRoyaltyInfo(royaltyReceiver, royalty);
  }

  function setTokenRoyalty(
    uint256 tokenId,
    address royaltyReceiver,
    uint96 royalty
  ) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
    super._setTokenRoyalty(tokenId, royaltyReceiver, royalty);
    emit TokenRoyaltyInfo(tokenId, royaltyReceiver, royalty);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721, ERC721Enumerable, ERC721Royalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
