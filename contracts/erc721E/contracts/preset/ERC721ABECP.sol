// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/Pausable.sol";

import "./ERC721ABEC.sol";

contract ERC721ABECP is ERC721ABEC, Pausable {
  constructor(string memory name, string memory symbol, uint256 cap) ERC721ABEC(name, symbol, cap) {
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override whenNotPaused {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
