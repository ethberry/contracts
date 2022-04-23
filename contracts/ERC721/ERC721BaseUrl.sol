// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ERC721BaseUrl {
  function _baseURI(string memory _baseTokenURI) internal view virtual returns (string memory) {
    return string(abi.encodePacked(_baseTokenURI, Strings.toHexString(uint160(address(this)), 20), "/"));
  }
}
