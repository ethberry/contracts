// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "../ChainLink/IERC721Link.sol";
import "../ERC721Tradable.sol";
import "../ERC721Mint.sol";


contract LootBox2 is ERC721Tradable, ERC721Mint {
    using Address for address;

    IERC721Link _tradable;
    string private _baseURL;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) ERC721(name, symbol) ERC721Capped(uint256(100)) {
        _baseURL = baseURL;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function setTradable(address tradableAddress_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tradableAddress_.isContract(), "LootBox: The Tradable must be a deployed contract");
        _tradable = IERC721Link(tradableAddress_);
    }

    function unpack(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == _msgSender(), "LootBox: Not an owner");
        _tradable.mintRandom();
        _burn(_tokenId);
    }

    function mintTo(address to) external onlyRole(MINTER_ROLE) {
        _mintTo(to);
    }

    /* Overrides */

    function _baseURI() internal view
    override (ERC721)
    returns (string memory) {
        return _baseURL;
    }

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721, ERC721Tradable) {
        ERC721Tradable._mint(to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721Tradable, ERC721URIStorage)
    {
        ERC721._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721, ERC721Tradable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view
    override(ERC721Tradable, ERC721URIStorage)
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Tradable, ERC721Mint)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
