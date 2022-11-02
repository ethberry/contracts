// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

import "../extensions/ERC721Capped.sol";
import "./ERC721ABC.sol";

contract ERC721ABCP is ERC721ABC, ERC721Pausable {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

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

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    virtual
    override(ERC721ABC, ERC721Pausable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
