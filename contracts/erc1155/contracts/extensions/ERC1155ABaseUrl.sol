// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155ABaseUrl is AccessControl, ERC1155 {
  event BaseURIUpdate(string baseTokenURI);

  function url(string memory uri) internal view virtual returns (string memory) {
    return string(abi.encodePacked(uri, "/", Strings.toHexString(address(this)), "/", "{id}"));
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setURI(baseTokenURI);
    emit BaseURIUpdate(baseTokenURI);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
