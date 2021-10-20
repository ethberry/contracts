// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "./TokenNft.opensea.sol";


contract TokenNft is Initializable, TokenNftOpenSea {
    function initialize(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) public initializer {
        __TokenNftOpenSea_init(name, symbol, baseURL);
    }
}