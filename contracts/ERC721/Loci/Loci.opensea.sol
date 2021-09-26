// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../ERC721TradableUpgradeable.sol";
import "../ERC721OpenSeaUpgradeable.sol";

contract LociOpenSea is Initializable, ERC721TradableUpgradeable, ERC721OpenSeaUpgradeable {
    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) public override initializer {
        __ERC721Tradable_init(_name, _symbol, _baseURI, 100);
        __ERC721OpenSea_init_unchained();
    }

    // The following functions are overrides required by Solidity.

    function _baseURI() internal view override (ERC721TradableUpgradeable, ERC721PresetMinterPauserAutoIdUpgradeable) returns (string memory) {
        return super._baseURI();
    }

    function isApprovedForAll(address owner, address operator)
    public
    view
    override(ERC721Upgradeable, ERC721OpenSeaUpgradeable)
    returns (bool)
    {
        return super.isApprovedForAll(owner, operator);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721Upgradeable, ERC721TradableUpgradeable)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721TradableUpgradeable, ERC721PresetMinterPauserAutoIdUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override(ERC721Upgradeable, ERC721TradableUpgradeable) {
        return super._mint(to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721Upgradeable, ERC721TradableUpgradeable)
    {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721TradableUpgradeable, ERC721PresetMinterPauserAutoIdUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}