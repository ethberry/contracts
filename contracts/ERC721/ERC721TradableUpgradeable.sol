// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";

import "../OpenSea/ProxyRegistry.sol";
import "./ERC721CappedUpgradeable.sol";

abstract contract ERC721TradableUpgradeable is Initializable,
    ERC721URIStorageUpgradeable,
    ERC721CappedUpgradeable,
    ERC721PausableUpgradeable,
    ERC721BurnableUpgradeable
{
    function __ERC721TradableUpgradeable_init(
    ) internal initializer {
        __ERC721URIStorage_init_unchained();
        __ERC721Capped_init_unchained(100);
        __ERC721TradableUpgradeable_init_unchained();
    }

    function __ERC721TradableUpgradeable_init_unchained() internal initializer {
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    virtual
    whenNotPaused
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721PausableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    virtual
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721Upgradeable, ERC721CappedUpgradeable) {
        return super._mint(to, tokenId);
    }
}