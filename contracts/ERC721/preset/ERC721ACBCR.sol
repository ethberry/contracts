// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../ERC721Capped.sol";

contract ERC721ACBCR is AccessControl, ERC721Burnable, ERC721Capped, ERC721Royalty {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  string internal _baseTokenURI;

  event DefaultRoyaltyInfo(address receiver, uint96 royaltyNumerator);
  event TokenRoyaltyInfo(uint256 tokenId, address receiver, uint96 royaltyNumerator);

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 cap,
    uint96 royaltyNumerator
  ) ERC721(name, symbol) ERC721Capped(cap) {
    _baseTokenURI = baseTokenURI;

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());

    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function mint(address to, uint256 tokenId) public virtual onlyRole(MINTER_ROLE) {
    _mint(to, tokenId);
  }

  function safeMint(address to, uint256 tokenId) public virtual onlyRole(MINTER_ROLE) {
    _safeMint(to, tokenId);
  }

  function setDefaultRoyalty(
    address receiver,
    uint96 royaltyNumerator
  ) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    super._setDefaultRoyalty(receiver, royaltyNumerator);
    emit DefaultRoyaltyInfo(receiver, royaltyNumerator);
  }

  function setTokenRoyalty(
    uint256 tokenId,
    address receiver,
    uint96 royaltyNumerator
  ) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    super._setTokenRoyalty(tokenId, receiver, royaltyNumerator);
    emit TokenRoyaltyInfo(tokenId, receiver, royaltyNumerator);
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721, ERC721Royalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function _mint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Capped) {
    super._mint(account, tokenId);
  }

  function _safeMint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Capped) {
    super._safeMint(account, tokenId);
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
