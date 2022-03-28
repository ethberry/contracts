// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IERC721Mintable.sol";

contract MarketplaceERC721ETH is AccessControl, Pausable {
  using Address for address;

  mapping(address => bool) internal _collections;
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function updateFactory(address collection, bool isEnabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _collections[collection] = isEnabled;
  }

  function buy(address collection, uint256 tokenId) public payable virtual whenNotPaused {
    require(_collections[collection], "Marketplace: collection is not enabled");
    uint256 price = getPrice(collection, tokenId);
    require(price == msg.value, "Marketplace: price mismatch");
    IERC721Mintable(collection).mint(_msgSender(), tokenId);
  }

  function getPrice(address, uint256) internal pure virtual returns (uint256) {
    return 0.0000000000001 ether;
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
