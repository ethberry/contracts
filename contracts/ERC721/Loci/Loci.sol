// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../ChainLink/ERC721LinkUpgradeable.sol";
import "../ERC721TradableUpgradeable.sol";

contract Loci is Initializable, ERC721TradableUpgradeable, ERC721LinkUpgradeable {
    function initialize(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) public initializer {
        __ERC721TradableUpgradeable_init_unchained();
        __Context_init_unchained();
        __ERC165_init_unchained();
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        __ERC721_init_unchained(name, symbol);
        __ERC721Enumerable_init_unchained();
        __ERC721Burnable_init_unchained();
        __Pausable_init_unchained();
        __ERC721Pausable_init_unchained();
        __ERC721LinkUpgradeable_init_unchained();
    }

    function mintRandom() external {
        queue[getRandomNumber(42)] = _msgSender();
    }

    /* overrides */

    function tokenURI(uint256 tokenId) public view
    override(ERC721TradableUpgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
    {
        return ERC721URIStorageUpgradeable.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721TradableUpgradeable, ERC721LinkUpgradeable)
    returns (bool)
    {
        return ERC721Upgradeable.supportsInterface(interfaceId);
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
}