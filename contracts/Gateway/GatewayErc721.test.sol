// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GatewayErc721 is ERC721, ERC721Enumerable, AccessControl {
  using Counters for Counters.Counter;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("Test erc721 token", "PNT") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
  }

  function _baseURI() internal pure override returns (string memory) {
    return "http://localhost/";
  }

  function safeMint(address to) public onlyRole(MINTER_ROLE) {
    _safeMint(to, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
  internal
  override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
  public
  view
  override
  returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
  public
  view
  override(ERC721, ERC721Enumerable, AccessControl)
  returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
