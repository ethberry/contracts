// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/access/IAccessControlEnumerable.sol";

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract InterfaceIdCalculator {
  function toHexDigit(uint8 d) internal pure returns (bytes1) {
    if (0 <= d && d <= 9) {
      return bytes1(uint8(bytes1("0")) + d);
    } else if (10 <= uint8(d) && uint8(d) <= 15) {
      return bytes1(uint8(bytes1("a")) + d - 10);
    }
    revert();
  }

  function fromCode(bytes4 code) public pure returns (string memory) {
    bytes memory result = new bytes(10);
    result[0] = bytes1("0");
    result[1] = bytes1("x");
    for (uint256 i = 0; i < 4; ++i) {
      result[2 * i + 2] = toHexDigit(uint8(code[i]) / 16);
      result[2 * i + 3] = toHexDigit(uint8(code[i]) % 16);
    }
    return string(result);
  }

  constructor() {
    console.log(fromCode(type(IERC721).interfaceId), "IERC721");
    console.log(fromCode(type(IERC721Enumerable).interfaceId), "IERC721Enumerable");
    console.log(fromCode(type(IERC721Metadata).interfaceId), "IERC721Metadata");

    console.log(fromCode(type(IERC20).interfaceId), "IERC20");
    console.log(fromCode(type(IERC20Metadata).interfaceId), "IERC20Metadata");

    console.log(fromCode(type(IAccessControl).interfaceId), "IAccessControl");
    console.log(fromCode(type(IAccessControlEnumerable).interfaceId), "IAccessControlEnumerable");

    console.log(fromCode(type(IERC165).interfaceId), "IERC165");
  }
}
