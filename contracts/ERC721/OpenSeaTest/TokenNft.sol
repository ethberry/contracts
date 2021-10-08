// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "./TokenNft.opensea.sol";


contract TokenNft is Initializable, TokenNftOpenSea {
    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) public initializer {
        __TokenNftOpenSea_init(_name, _symbol, _baseURI);
    }
}