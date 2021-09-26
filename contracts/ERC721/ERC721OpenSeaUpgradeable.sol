// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/presets/ERC721PresetMinterPauserAutoIdUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "./ProxyRegistry.sol";

/**
 * @dev Extension of {ERC721} that adds a cap to the supply of tokens.
 */
abstract contract ERC721OpenSeaUpgradeable is Initializable, ERC721PresetMinterPauserAutoIdUpgradeable {
    using AddressUpgradeable for address;

    ProxyRegistry private _proxyRegistry;

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */
    function __ERC721OpenSea_init(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_
    ) internal initializer {
        __ERC721PresetMinterPauserAutoId_init(name_, symbol_, baseTokenURI_);
        __ERC721OpenSea_init_unchained();
    }

    function __ERC721OpenSea_init_unchained() internal initializer {
    }

    function setProxyRegistry(address proxyRegistry_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(proxyRegistry_.isContract(), "ERC721OpenSeaUpgradeable: The ProxyRegistry must be a deployed contract");
        _proxyRegistry = ProxyRegistry(proxyRegistry_);
    }

    function owner() public view virtual returns (address) {
        return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }

    function baseTokenURI() public view returns (string memory){
        return _baseURI();
    }

    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner_, address operator_)
    override
    virtual
    public
    view
    returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        if (address(_proxyRegistry.proxies(owner_)) == operator_) {
            return true;
        }

        return super.isApprovedForAll(owner_, operator_);
    }
}
