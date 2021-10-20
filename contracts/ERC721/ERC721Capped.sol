// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


/**
 * @dev Extension of {ERC721} that adds a cap to the supply of tokens.
 */
abstract contract ERC721Capped is ERC721Enumerable {
    uint256 private _cap;

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */
     constructor(uint256 cap_) {
         require(cap_ > 0, "ERC721Capped: cap is 0");
         _cap = cap_;
    }

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    /**
     * @dev See {ERC721-_mint}.
     */
    function _mint(address to_, uint256 tokenId_) internal virtual override {
        require(ERC721Enumerable.totalSupply() <= cap(), "ERC721Capped: cap exceeded");
        super._mint(to_, tokenId_);
    }
    /**
     * @dev public set cap.
     */
    function _setCap(uint256 _newcap) public virtual
    {
        require(ERC721Enumerable.totalSupply() <= _newcap, "ERC721Capped: cap too low");
        _cap = _newcap;
    }
}
