// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

interface IPriceOracle {
    function priceInWei() external returns (uint256);
}