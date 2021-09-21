// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract PriceOracle is OwnableUpgradeable {
  // How much PLAT you get for 1 ETH, multiplied by 10^18
  uint256 public price;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize() initializer public {
    __Ownable_init();
    price = 1000 * 1e18;
  }

  event PriceChanged(uint256 newPrice);

  function updatePrice(uint256 _newPrice) onlyOwner public {
    require(_newPrice > 0, "Price should be bigger than 0");
    price = _newPrice;
    emit PriceChanged(_newPrice);
  }
}