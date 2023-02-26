// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

contract ERC721ABE is AccessControl, ERC721Burnable, ERC721Enumerable {
  using Counters for Counters.Counter;

  Counters.Counter internal _tokenIdTracker;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
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

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
