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

import "./Formatter.sol";
import "./Convertor.sol";

contract InterfaceIdCalculator is Formatter, Convertor {
  constructor() {
    console.log(fromCode(bytes4ToBytes(type(IERC721).interfaceId)), "IERC721");
    console.log(fromCode(bytes4ToBytes(type(IERC721Enumerable).interfaceId)), "IERC721Enumerable");
    console.log(fromCode(bytes4ToBytes(type(IERC721Metadata).interfaceId)), "IERC721Metadata");

    console.log(fromCode(bytes4ToBytes(type(IERC20).interfaceId)), "IERC20");
    console.log(fromCode(bytes4ToBytes(type(IERC20Metadata).interfaceId)), "IERC20Metadata");

    console.log(fromCode(bytes4ToBytes(type(IAccessControl).interfaceId)), "IAccessControl");
    console.log(fromCode(bytes4ToBytes(type(IAccessControlEnumerable).interfaceId)), "IAccessControlEnumerable");

    console.log(fromCode(bytes4ToBytes(type(IERC165).interfaceId)), "IERC165");
  }
}
