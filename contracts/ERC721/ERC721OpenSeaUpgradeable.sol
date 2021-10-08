// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "../OpenSea/ProxyRegistry.sol";

abstract contract ERC721OpenSeaUpgradeable is
        Initializable,
        ERC721Upgradeable,
        AccessControlEnumerableUpgradeable
{

    using AddressUpgradeable for address;
    ProxyRegistry private _proxyRegistry;

    function __ERC721OpenSeaUpgradeable_init() internal initializer {
        __ERC721OpenSeaUpgradeable_init_unchained();
    }

    function __ERC721OpenSeaUpgradeable_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setProxyRegistry(address proxyRegistry_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(proxyRegistry_.isContract(), "ERC721OpenSeaUpgradeable: The ProxyRegistry must be a deployed contract");
        _proxyRegistry = ProxyRegistry(proxyRegistry_);
    }

    function owner() public view virtual returns (address) {
        return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }


    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner_, address operator_)
    override (ERC721Upgradeable)
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

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Upgradeable, AccessControlEnumerableUpgradeable)
    returns (bool)
    {
        return AccessControlEnumerableUpgradeable.supportsInterface(interfaceId);
    }
    uint256[48] private __gap;
}
