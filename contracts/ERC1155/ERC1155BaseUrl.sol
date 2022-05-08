// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ERC1155BaseUrl {
  function url(string memory uri) internal view virtual returns (string memory) {
    return string(abi.encodePacked(uri, Strings.toHexString(uint160(address(this)), 20), "/", "{id}"));
  }
}
