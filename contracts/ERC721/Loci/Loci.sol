// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../ERC721TradableUpgradeable.sol";


contract Loci is Initializable, ERC721TradableUpgradeable {
    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) public override initializer {
        __ERC721Tradable_init(_name, _symbol, _baseURI, 100);
    }
}