// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../ERC721TradableUpgradeable.sol";
import "../IFactoryERC721.sol";
import "./Loci.sol";


contract LociLootBox is Initializable, ERC721TradableUpgradeable {
    uint256 NUM_CREATURES_PER_BOX = 3;
    uint256 OPTION_ID = 0;
    address factoryAddress;

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) public override initializer {
        __ERC721Tradable_init(_name, _symbol, _baseURI, 100);
    }

    function unpack(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == _msgSender());

        IFactoryERC721 factory = IFactoryERC721(factoryAddress);
        factory.mint(1, _msgSender());

        _burn(_tokenId);
    }
}
