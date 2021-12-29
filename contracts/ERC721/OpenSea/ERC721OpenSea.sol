// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./utils/ProxyRegistry.sol";

abstract contract ERC721OpenSea is ERC721, AccessControlEnumerable {

    using Address for address;
    ProxyRegistry private _proxyRegistry;

    function setProxyRegistry(address proxyRegistry_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(proxyRegistry_.isContract(), "ERC721OpenSea: The ProxyRegistry must be a deployed contract");
        _proxyRegistry = ProxyRegistry(proxyRegistry_);
    }

    function owner() public view virtual returns (address) {
        return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }


    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner_, address operator_)
    override (ERC721)
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
    override(ERC721, AccessControlEnumerable)
    returns (bool)
    {
        return AccessControlEnumerable.supportsInterface(interfaceId);
    }
}
