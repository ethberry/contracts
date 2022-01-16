// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

import "./ERC721Gemunion.sol";

/**
 * @dev {ERC721} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *  - token ID and URI autogeneration
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
abstract contract ERC721GemunionPausable is ERC721Pausable, ERC721Gemunion {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 cap
  ) ERC721Gemunion(name, symbol, baseTokenURI, cap) {
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  /**
   * @dev Pauses all token transfers.
   *
   * See {ERC721Pausable} and {Pausable-_pause}.
   *
   * Requirements:
   *
   * - the caller must have the `PAUSER_ROLE`.
   */
  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /**
   * @dev Unpauses all token transfers.
   *
   * See {ERC721Pausable} and {Pausable-_unpause}.
   *
   * Requirements:
   *
   * - the caller must have the `PAUSER_ROLE`.
   */
  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, ERC721Gemunion)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721Gemunion) returns (string memory) {
    return super.tokenURI(tokenId);
  }


  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Gemunion) {
    return super._burn(tokenId);
  }

  function _baseURI() internal view virtual override(ERC721, ERC721Gemunion) returns (string memory) {
    return _baseTokenURI;
  }

  function _mint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Gemunion) {
    super._mint(account, tokenId);
  }

  function _safeMint(address account, uint256 tokenId) internal virtual override(ERC721, ERC721Gemunion) {
    super._safeMint(account, tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721Pausable, ERC721Gemunion) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
