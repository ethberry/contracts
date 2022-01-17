// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../EIP712/interfaces/IEIP712ERC1155Droppable.sol";
import "./preset/ERC1155ACBSP.sol";

contract ERC1155Droppable is IEIP712ERC1155Droppable, ERC1155ACBSP {
  constructor(string memory baseTokenURI) ERC1155ACBSP(baseTokenURI) {}

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public override(IEIP712ERC1155Droppable, ERC1155ACBSP) {
    super.mintBatch(to, ids, amounts, data);
  }
}
