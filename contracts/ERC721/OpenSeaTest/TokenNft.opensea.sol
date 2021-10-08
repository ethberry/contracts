// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../ERC721TradableUpgradeable.sol";
import "../ERC721OpenSeaUpgradeable.sol";
import "../ERC721MintUpgradeable.sol";


abstract contract TokenNftOpenSea is Initializable,
            ERC721TradableUpgradeable,
            ERC721OpenSeaUpgradeable,
            ERC721MintUpgradeable
{
    string private baseAPI;

    function __TokenNftOpenSea_init(
        string memory _name,
        string memory _symbol,
        string memory _baseAPI
    ) public initializer {
        __ERC721_init_unchained(_name, _symbol);
        __ERC721Capped_init_unchained(uint256(100));

        __ERC721Enumerable_init_unchained();
        __ERC721Burnable_init_unchained();
        __ERC721Pausable_init_unchained();

        __Pausable_init_unchained();
        __Context_init_unchained();
        __ERC165_init_unchained();
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();

        __ERC721TradableUpgradeable_init_unchained();
        __ERC721OpenSeaUpgradeable_init_unchained();
        __ERC721MintUpgradeable_init_unchained();

        baseAPI = _baseAPI;
    }

    // implementation contract functions

    function mint(address to) public
    {
        _mintTo(to);
    }
    /**
     * @dev public set cap.
     */

    function _setCap(uint256 _newcap) public
    override (ERC721CappedUpgradeable)
    {
        require(_msgSender() == owner(), "ERC721Capped: new cap too low");
        super._setCap(_newcap);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal
    whenNotPaused
    override(ERC721Upgradeable, ERC721TradableUpgradeable)
    {
        ERC721TradableUpgradeable._beforeTokenTransfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal
    override(ERC721Upgradeable, ERC721TradableUpgradeable)
    {
        ERC721TradableUpgradeable._mint(to, tokenId);
    }

    /* internal view functions */

    function _baseURI() internal
    view
    override (ERC721Upgradeable)
    returns (string memory) {
        // return "https://us-central1-encoder-memoryos.cloudfunctions.net/LociNftMetadataJson/";
        return baseAPI;
    }

    /* public view functions */
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721TradableUpgradeable)
    returns (string memory)
    {
        return ERC721TradableUpgradeable.tokenURI(tokenId);
    }

    function isApprovedForAll(address owner, address operator)
    public
    view
    override(ERC721Upgradeable, ERC721OpenSeaUpgradeable)
    returns (bool)
    {
        return ERC721OpenSeaUpgradeable.isApprovedForAll(owner, operator);
    }

    function _burn(uint256 tokenId) internal
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721TradableUpgradeable)
    {
        ERC721TradableUpgradeable._burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId) // todo how its works ???
    public
    view
    virtual
    override(ERC721TradableUpgradeable, ERC721OpenSeaUpgradeable, ERC721MintUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}