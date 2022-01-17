// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";

import "../../ERC721/preset/ERC721ACBECP.sol";
import "../../ERC721/ChainLink/interfaces/IERC721ChainLink.sol";

contract ChainLinkLootboxMock is ERC721ACBECP {
  using Address for address;

  IERC721ChainLink _factory;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721ACBECP(name, symbol, baseTokenURI, 1000) {}

  receive() external payable {
    revert();
  }

  function setFactory(address factory) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(factory.isContract(), "LootBox: the factory must be a deployed contract");
    _factory = IERC721ChainLink(factory);
  }

  function unpack(uint256 _tokenId) public whenNotPaused {
    require(_isApprovedOrOwner(_msgSender(), _tokenId), "LootBox: unpack caller is not owner nor approved");
    _factory.mintRandom(_msgSender());
    _burn(_tokenId);
  }
}
