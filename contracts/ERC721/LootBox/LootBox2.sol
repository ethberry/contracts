// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "../ChainLink/IERC721LinkUpgradeable.sol";
import "../ERC721TradableUpgradeable.sol";
import "../ERC721MintUpgradeable.sol";


contract LootBox2 is Initializable, ERC721TradableUpgradeable, ERC721MintUpgradeable {
    using AddressUpgradeable for address;

    IERC721LinkUpgradeable _tradable;

    string private _baseURL;

    function initialize(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) public initializer {
        __ERC721TradableUpgradeable_init_unchained();
        __ERC721MintUpgradeable_init_unchained();
        __Context_init_unchained();
        __ERC165_init_unchained();
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        __ERC721_init_unchained(name, symbol);
        __ERC721Enumerable_init_unchained();
        __ERC721Burnable_init_unchained();
        __Pausable_init_unchained();
        __ERC721Pausable_init_unchained();

        _baseURL = baseURL;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function setTradable(address tradableAddress_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tradableAddress_.isContract(), "LootBox: The Tradable must be a deployed contract");
        _tradable = IERC721LinkUpgradeable(tradableAddress_);
    }

    function unpack(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == _msgSender(), "LootBox: Not an owner");
        _tradable.mintRandom();
        _burn(_tokenId);
    }

    function mintTo(address to) external onlyRole(MINTER_ROLE) {
        _mintTo(to);
    }

    /* Overrides */

    function _baseURI() internal view
    override (ERC721Upgradeable)
    returns (string memory) {
        return _baseURL;
    }

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721Upgradeable, ERC721TradableUpgradeable) {
        ERC721TradableUpgradeable._mint(to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721TradableUpgradeable, ERC721URIStorageUpgradeable)
    {
        ERC721Upgradeable._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721Upgradeable, ERC721TradableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view
    override(ERC721TradableUpgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
    {
        return ERC721URIStorageUpgradeable.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721TradableUpgradeable, ERC721MintUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
