// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";

import "../extensions/ERC721Capped.sol";
import "./ERC721ABC.sol";

contract ERC721ABCP is ERC721ABC, Pausable {
  constructor(string memory name, string memory symbol, uint256 cap) ERC721ABC(name, symbol, cap) {
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override whenNotPaused returns (address)  {
    return super._update(to, tokenId, auth);
  }
}
