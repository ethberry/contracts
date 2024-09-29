// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155ABS } from "./ERC1155ABS.sol";
import { ERC1155ARoyalty } from "../extensions/ERC1155ARoyalty.sol";

contract ERC1155ABSR is ERC1155ABS, ERC1155ARoyalty {
  constructor(uint96 royaltyNumerator, string memory uri) ERC1155ABS(uri) ERC1155ARoyalty(royaltyNumerator) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC1155ABS, ERC1155ARoyalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
