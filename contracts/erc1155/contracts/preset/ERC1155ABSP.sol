// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+opensource@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Pausable } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";

import { PAUSER_ROLE } from "@ethberry/contracts-utils/contracts/roles.sol";

import { ERC1155ABS } from "./ERC1155ABS.sol";

contract ERC1155ABSP is ERC1155ABS, ERC1155Pausable {
  constructor(string memory uri) ERC1155ABS(uri) {
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function _update(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts
  ) internal virtual override(ERC1155ABS, ERC1155Pausable) {
    super._update(from, to, ids, amounts);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155ABS) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
