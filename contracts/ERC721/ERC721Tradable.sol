// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./ERC721Capped.sol";

abstract contract ERC721Tradable is ERC721Capped, ERC721URIStorage, ERC721Pausable, ERC721Burnable {
    // The following functions are overrides required by Solidity.

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721, ERC721Capped)
    {
         ERC721Capped._mint(to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    virtual
    whenNotPaused
    override(ERC721, ERC721Pausable, ERC721Enumerable)
    {
        ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    virtual
    override(ERC721, ERC721URIStorage)
    {
        ERC721URIStorage._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return ERC721Enumerable.supportsInterface(interfaceId);
    }
}