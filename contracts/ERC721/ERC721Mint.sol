// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


abstract contract ERC721Mint is Context, ERC721URIStorage, AccessControlEnumerable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIdTracker;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

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
    override(ERC721, AccessControlEnumerable)
    returns (bool)
    {
        return AccessControlEnumerable.supportsInterface(interfaceId);
    }
}