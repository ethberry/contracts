// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ERC1155BaseUrl {
  function url(string memory uri) internal view virtual returns (string memory) {
    return string(abi.encodePacked(uri, "/", Strings.toHexString(uint160(address(this)), 20), "/", "{id}"));
  }
}
