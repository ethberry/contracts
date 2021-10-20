// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "./ERC721CappedUpgradeable.sol";

abstract contract ERC721TradableUpgradeable is Initializable,
    ERC721CappedUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721PausableUpgradeable,
    ERC721BurnableUpgradeable
{
    function __ERC721TradableUpgradeable_init() internal initializer {
        __ERC721Capped_init_unchained(uint256(100));
        __ERC721URIStorage_init_unchained();
        __ERC721Pausable_init_unchained();
        __ERC721Burnable_init_unchained();

        __ERC721TradableUpgradeable_init_unchained();
    }

    function __ERC721TradableUpgradeable_init_unchained() internal initializer {
    }

    // The following functions are overrides required by Solidity.

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721Upgradeable, ERC721CappedUpgradeable)
    {
         ERC721CappedUpgradeable._mint(to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    virtual
    whenNotPaused
    override(ERC721Upgradeable, ERC721PausableUpgradeable, ERC721EnumerableUpgradeable)
    {
        ERC721EnumerableUpgradeable._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    virtual
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        ERC721URIStorageUpgradeable._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
    {
        return ERC721URIStorageUpgradeable.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    returns (bool)
    {
        return ERC721EnumerableUpgradeable.supportsInterface(interfaceId);
    }
}