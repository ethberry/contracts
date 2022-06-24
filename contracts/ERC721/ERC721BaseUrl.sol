// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ERC721BaseUrl {
  string internal _baseTokenURI;

  constructor(string memory baseTokenURI) {
    _setBaseURI(baseTokenURI);
  }

  function _baseURI(string memory baseTokenURI) internal view virtual returns (string memory) {
    return string(abi.encodePacked(baseTokenURI, "/", Strings.toHexString(uint160(address(this)), 20), "/"));
  }

  function _setBaseURI(string memory baseTokenURI) internal virtual {
    _baseTokenURI = baseTokenURI;
  }
}
