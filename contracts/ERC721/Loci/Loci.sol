// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Loci.opensea.sol";


contract Loci is Initializable, LociOpenSea {
    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) public initializer {
        __LociOpenSea_init(_name, _symbol, _baseURI);
    }
}