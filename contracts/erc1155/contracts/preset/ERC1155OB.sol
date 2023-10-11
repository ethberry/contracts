// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from  "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155OB is Ownable, ERC1155Burnable {
  constructor(string memory uri) ERC1155(uri) Ownable(_msgSender()) {}

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
