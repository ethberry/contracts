// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {
  uint256 public priceInWei;

  constructor() {
    priceInWei = 1; // initial price is 1 wei
  }

  event PriceChanged(uint256 newPrice);

  function updatePrice(uint256 _newPrice) onlyOwner public {
    require(_newPrice > 0, "Price should be bigger than 0");
    priceInWei = _newPrice;
    emit PriceChanged(_newPrice);
  }
}
