// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";

import "./ERC1155ABS.sol";

contract ERC1155ABSP is ERC1155ABS, ERC1155Pausable {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(string memory uri) ERC1155ABS(uri) {
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override(ERC1155ABS, ERC1155Pausable) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155ABS) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
