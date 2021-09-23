// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/presets/ERC721PresetMinterPauserAutoIdUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "./ProxyRegistry.sol";

contract Loci is Initializable, ERC721PresetMinterPauserAutoIdUpgradeable, ERC721URIStorageUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using AddressUpgradeable for address;

    CountersUpgradeable.Counter private _tokenIdCounter;

    ProxyRegistry proxyRegistry;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        address _proxyRegistry
    ) initializer public {
        __ERC721PresetMinterPauserAutoId_init(_name, _symbol, _baseURI);
        __ERC721URIStorage_init();

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());

        require(_proxyRegistry.isContract(), "The ProxyRegistry must be a deployed contract");
        proxyRegistry = ProxyRegistry(_proxyRegistry);
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    /*
     * OpenSea specific method
     * https://docs.opensea.io/docs/1-structuring-your-smart-contract
    */

    function baseTokenURI() public view returns (string memory){
        return _baseURI();
    }

    function isApprovedForAll(address owner, address operator)
    override
    public
    view
    returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }

    function owner() public view virtual returns (address) {
        return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }

    // The following functions are overrides required by Solidity.

    function _baseURI() internal view override (ERC721Upgradeable, ERC721PresetMinterPauserAutoIdUpgradeable) returns (string memory) {
        return super._baseURI();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721Upgradeable, ERC721PresetMinterPauserAutoIdUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Upgradeable, ERC721PresetMinterPauserAutoIdUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}