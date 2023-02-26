// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

contract ERC721AB is AccessControl, ERC721Burnable {
  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    address account = _msgSender();

    _setupRole(DEFAULT_ADMIN_ROLE, account);
    _setupRole(MINTER_ROLE, account);
  }

  function mint(address to, uint256 tokenId) public virtual onlyRole(MINTER_ROLE) {
    _mint(to, tokenId);
  }

  function safeMint(address to, uint256 tokenId) public virtual onlyRole(MINTER_ROLE) {
    _safeMint(to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
