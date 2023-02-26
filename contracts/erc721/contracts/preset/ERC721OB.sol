// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

contract ERC721OB is Ownable, ERC721Burnable {
  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  function mint(address to, uint256 tokenId) public virtual onlyOwner {
    _mint(to, tokenId);
  }

  function safeMint(address to, uint256 tokenId) public virtual onlyOwner {
    _safeMint(to, tokenId);
  }
}
