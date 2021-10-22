// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;


import "../../ERC721Tradable.sol";
import "../../ERC721Mint.sol";
import "../ERC721OpenSea.sol";


abstract contract TokenNftOpenSea is ERC721Tradable, ERC721OpenSea, ERC721Mint {
    string private _baseURL;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) ERC721(name, symbol) ERC721Capped(uint256(100)) {
        _baseURL = baseURL;
    }

    // implementation contract functions

    function mint(address to) public {
        _mintTo(to);
    }
    /**
     * @dev public set cap.
     */

    function _setCap(uint256 _newcap) public override (ERC721Capped) {
        require(_msgSender() == owner(), "ERC721Capped: new cap too low");
        super._setCap(_newcap);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal
    whenNotPaused
    override(ERC721, ERC721Tradable)
    {
        ERC721Tradable._beforeTokenTransfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal
    override(ERC721, ERC721Tradable)
    {
        ERC721Tradable._mint(to, tokenId);
    }

    /* internal view functions */

    function _baseURI() internal view override (ERC721)
    returns (string memory) {
        // return "https://us-central1-encoder-memoryos.cloudfunctions.net/LociNftMetadataJson/";
        return _baseURL;
    }

    /* public view functions */
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage, ERC721Tradable)
    returns (string memory)
    {
        return ERC721Tradable.tokenURI(tokenId);
    }

    function isApprovedForAll(address owner, address operator)
    public
    view
    override(ERC721, ERC721OpenSea)
    returns (bool)
    {
        return ERC721OpenSea.isApprovedForAll(owner, operator);
    }

    function _burn(uint256 tokenId) internal
    override(ERC721, ERC721URIStorage, ERC721Tradable)
    {
        ERC721Tradable._burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId) // todo how its works ???
    public
    view
    virtual
    override(ERC721Tradable, ERC721OpenSea, ERC721Mint)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}