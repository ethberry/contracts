// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;


import "../ChainLink/ERC721Link.sol";
import "../ERC721Tradable.sol";
import "./ERC721OpenSea.sol";


contract LociOpenSea is ERC721Tradable, ERC721OpenSea, ERC721Link {
    string private _baseURL;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) ERC721(name, symbol) ERC721Capped(uint256(100)) {
        _baseURL = baseURL;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    // The following functions are overrides required by Solidity.

    function _baseURI() internal view
    override (ERC721)
    returns (string memory) {
        return _baseURL;
    }

    function tokenURI(uint256 tokenId) public view
    override(ERC721, ERC721Tradable, ERC721URIStorage)
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function isApprovedForAll(address owner, address operator)
    public
    view
    override(ERC721, ERC721OpenSea)
    returns (bool)
    {
        return ERC721OpenSea.isApprovedForAll(owner, operator);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Tradable, ERC721Link, ERC721OpenSea)
    returns (bool)
    {
        return ERC721.supportsInterface(interfaceId);
    }

    function mintRandom() external {
        queue[getRandomNumber()] = _msgSender();
    }

    function _mint(address to, uint256 tokenId) internal virtual
    override(ERC721, ERC721Tradable) {
        ERC721Tradable._mint(to, tokenId);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721Tradable, ERC721URIStorage)
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
}