// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

import "../extensions/ERC721Capped.sol";
import "./ERC721ABC.sol";

contract ERC721ABCP is ERC721ABC, ERC721Pausable {
  constructor(string memory name, string memory symbol, uint256 cap) ERC721ABC(name, symbol, cap) {
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721ABC, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721Pausable, ERC721ABC) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
