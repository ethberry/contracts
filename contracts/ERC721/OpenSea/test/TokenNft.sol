// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "./TokenNft.opensea.sol";


contract TokenNft is TokenNftOpenSea {
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) TokenNftOpenSea(name, symbol, baseURL) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }
}