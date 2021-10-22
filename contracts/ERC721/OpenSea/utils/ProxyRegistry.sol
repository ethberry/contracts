// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "./OwnableDelegateProxy.sol";

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}