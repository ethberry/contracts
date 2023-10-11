// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract ERC721ABaseUrl is AccessControl {
  string internal _baseTokenURI;

  constructor(string memory baseTokenURI) {
    _setBaseURI(baseTokenURI);
  }

  function _baseURI(string memory baseTokenURI) internal view virtual returns (string memory) {
    return string(abi.encodePacked(baseTokenURI, "/", Strings.toHexString(uint160(address(this)), 20), "/"));
  }

  function _baseURI() internal view virtual returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function _setBaseURI(string memory baseTokenURI) internal virtual {
    _baseTokenURI = baseTokenURI;
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setBaseURI(baseTokenURI);
  }
}
