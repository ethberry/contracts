// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


import "../ERC721Tradable.sol";
import "../IERC721Factory.sol";
import "../Loci/Loci.sol";


contract LootBox is ERC721Tradable, AccessControl {
    using Address for address;

    IERC721Factory _factory;
    string private _baseURL;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURL
    ) ERC721(name, symbol) ERC721Capped(uint256(100)) {
        // TODO test baseURL;
        _baseURL = baseURL;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setFactory(address factory_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(factory_.isContract(), "LootBox: The Factory must be a deployed contract");
        _factory = IERC721Factory(factory_);
    }

    function unpack(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == _msgSender());

        _factory.mint(1, _msgSender());

        _burn(_tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
        //    override(ERC721, ERC721Enumerable, ERC721PresetMinterPauserAutoId)
    override(AccessControl, ERC721Tradable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
