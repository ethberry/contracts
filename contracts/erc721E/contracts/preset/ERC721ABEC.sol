// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-misc/contracts/Counters.sol";
import "@gemunion/contracts-misc/contracts/roles.sol";

import "../extensions/ERC721CappedEnumerable.sol";

contract ERC721ABEC is AccessControl, ERC721Burnable, ERC721CappedEnumerable {
  using Counters for Counters.Counter;

  Counters.Counter internal _tokenIdTracker;

  constructor(string memory name, string memory symbol, uint256 cap) ERC721(name, symbol) ERC721CappedEnumerable(cap) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to) public virtual onlyRole(MINTER_ROLE) {
    _mint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function safeMint(address to) public virtual onlyRole(MINTER_ROLE) {
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function getCurrentTokenIndex() public view returns (uint256) {
    return _tokenIdTracker.current();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721CappedEnumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, amount);
  }
}
