// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../ERC721TradableUpgradeable.sol";
import "../ERC721OpenSeaUpgradeable.sol";
import "../ERC721LinkUpgradeable.sol";


abstract contract LociOpenSea is Initializable,
            ERC721TradableUpgradeable,
            ERC721OpenSeaUpgradeable,
            ERC721LinkUpgradeable
{
    string private baseAPI;

    function __LociOpenSea_init(
        string memory _name,
        string memory _symbol,
        string memory _baseAPI
    ) public initializer {
        __ERC721TradableUpgradeable_init_unchained();
        __ERC721OpenSeaUpgradeable_init_unchained();
        __ERC721LinkUpgradeable_init_unchained();
        __Context_init_unchained();
        __ERC165_init_unchained();
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        __ERC721_init_unchained(_name, _symbol);
        __ERC721Enumerable_init_unchained();
        __ERC721Burnable_init_unchained();
        __Pausable_init_unchained();
        __ERC721Pausable_init_unchained();

        baseAPI = _baseAPI;

    }

    // The following functions are overrides required by Solidity.

    function _baseURI() internal view
    override (ERC721Upgradeable)
    returns (string memory) {
        // return "https://us-central1-encoder-memoryos.cloudfunctions.net/LociNftMetadataJson/";
        return baseAPI;
    }

    function tokenURI(uint256 tokenId) public view
    override(ERC721Upgradeable, ERC721TradableUpgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
    {
        return ERC721URIStorageUpgradeable.tokenURI(tokenId);
    }

    function isApprovedForAll(address owner, address operator)
    public
    view
    override(ERC721Upgradeable, ERC721OpenSeaUpgradeable)
    returns (bool)
    {
        return ERC721OpenSeaUpgradeable.isApprovedForAll(owner, operator);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721TradableUpgradeable, ERC721LinkUpgradeable, ERC721OpenSeaUpgradeable)
    returns (bool)
    {
        return ERC721Upgradeable.supportsInterface(interfaceId);
    }

    function mintRandom() external {
        queue[getRandomNumber(42)] = _msgSender();
    }

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721Upgradeable, ERC721TradableUpgradeable) {
        ERC721TradableUpgradeable._mint(to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721Upgradeable, ERC721TradableUpgradeable, ERC721URIStorageUpgradeable)
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