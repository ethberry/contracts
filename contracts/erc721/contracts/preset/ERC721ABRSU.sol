// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721ABRS.sol";
import "../extensions/ERC4907.sol";


contract ERC721ABRSU is ERC721ABRS, ERC4907 {

    constructor(
        string memory name,
        string memory symbol,
        uint96 royaltyNumerator
    ) ERC721ABRS(name, symbol, royaltyNumerator) {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC4907, ERC721ABRS )
        returns (bool)
    {
        return  ERC4907.supportsInterface(interfaceId) || ERC721ABRS.supportsInterface(interfaceId);
    }

    function _isApprovedOrOwner(address owner, uint256 tokenId) internal view override(ERC721, ERC4907) returns (bool){
        return super._isApprovedOrOwner(owner, tokenId);
    }
}
