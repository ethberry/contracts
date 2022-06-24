// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IERC1155Mintable.sol";

contract MarketplaceERC1155ETH is AccessControl, Pausable {
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

  function buy(
    address collection,
    uint256[] memory tokenIds,
    uint256[] memory amounts
  ) public payable virtual whenNotPaused {
    require(_collections[collection], "Marketplace: collection is not enabled");
    require(tokenIds.length == amounts.length, "Marketplace: tokenIds and amounts length mismatch");

    uint256 price = 0;
    for (uint256 i = 0; i < tokenIds.length; i++) {
      price += getPrice(collection, tokenIds[i], amounts[i]);
    }

    require(price == msg.value, "Marketplace: price mismatch");
    IERC1155Mintable(collection).mintBatch(_msgSender(), tokenIds, amounts, "0x");
  }

  function getPrice(
    address,
    uint256,
    uint256
  ) internal pure virtual returns (uint256) {
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
