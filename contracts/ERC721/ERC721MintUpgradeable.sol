// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";


abstract contract ERC721MintUpgradeable is Initializable,
        ContextUpgradeable,
        ERC721URIStorageUpgradeable,
        AccessControlEnumerableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter public _tokenIdTracker;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    function __ERC721MintUpgradeable_init() public initializer {
        __ERC721MintUpgradeable_init_unchained();
    }

    function __ERC721MintUpgradeable_init_unchained() public initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function _getCurrentTokenindex() public view // test dev
    returns (uint256)
    {
        return _tokenIdTracker.current();
    }

    function _mintTo(address to) internal virtual onlyRole(MINTER_ROLE) {
        _mint(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual
    override(ERC721Upgradeable, AccessControlEnumerableUpgradeable)
    returns (bool)
    {
        return AccessControlEnumerableUpgradeable.supportsInterface(interfaceId);
    }

    uint256[48] private __gap;
}