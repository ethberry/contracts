// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155OB is Ownable, ERC1155Burnable {
  constructor(string memory uri) ERC1155(uri) {}

  function mint(address to, uint256 id, uint256 amount, bytes memory data) public virtual onlyOwner {
    _mint(to, id, amount, data);
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public virtual onlyOwner {
    _mintBatch(to, ids, amounts, data);
  }
}
