// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IPriceOracle {
    function priceInWei() external returns (uint256);
}