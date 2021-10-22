// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;


import "../ChainLink/ERC721Link.sol";
import "../ERC721Tradable.sol";

contract Loci is ERC721Tradable, ERC721Link {

    string private _baseURL;

    constructor (
        string memory name,
        string memory symbol,
        string memory baseURL
    ) ERC721(name, symbol) ERC721Capped(uint256(100)) {
        // TODO test baseURL;
        _baseURL = baseURL;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function mintRandom() external {
        queue[getRandomNumber()] = _msgSender();
    }

    /* overrides */

    function tokenURI(uint256 tokenId) public view
    override(ERC721Tradable, ERC721URIStorage)
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Tradable, ERC721Link)
    returns (bool)
    {
        return ERC721.supportsInterface(interfaceId);
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
}