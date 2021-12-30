// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./utils/ProxyRegistry.sol";
import "../../ERC721/ERC721Gemunion.sol";

abstract contract ERC721OpenSea is ERC721Gemunion {

  event PermanentURI(string _value, uint256 indexed _id);

  using Address for address;
  ProxyRegistry private _proxyRegistry;

  function setProxyRegistry(address proxyRegistry) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(proxyRegistry.isContract(), "ERC721OpenSea: The ProxyRegistry must be a deployed contract");
    _proxyRegistry = ProxyRegistry(proxyRegistry);
  }

  function owner() public view virtual returns (address) {
    return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
  }

  /**
   * @dev Set a static URI for a token
   */
  function setTokenURI(uint256 tokenId, string memory _tokenURI) public override onlyRole(DEFAULT_ADMIN_ROLE) {
    _setTokenURI(tokenId, _tokenURI);
    emit PermanentURI(_tokenURI, tokenId);
  }

  /**
   * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
   */
  function isApprovedForAll(address owner_, address operator_) override (ERC721) virtual public view returns (bool) {
    // Whitelist OpenSea proxy contract for easy trading.
    if (address(_proxyRegistry.proxies(owner_)) == operator_) {
      return true;
    }

    return super.isApprovedForAll(owner_, operator_);
  }
}
