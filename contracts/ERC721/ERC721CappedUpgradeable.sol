// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";


/**
 * @dev Extension of {ERC721} that adds a cap to the supply of tokens.
 */
abstract contract ERC721CappedUpgradeable is Initializable, ERC721EnumerableUpgradeable {
    uint256 private _cap;

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */
    function __ERC721Capped_init(uint256 cap_) internal initializer {
        __Context_init_unchained();
        __ERC721Capped_init_unchained(cap_);
    }

    function __ERC721Capped_init_unchained(uint256 cap_) internal initializer {
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
        require(ERC721EnumerableUpgradeable.totalSupply() <= cap(), "ERC721Capped: cap exceeded");
        super._mint(to_, tokenId_);
    }
    /**
     * @dev public set cap.
     */
    function _setCap(uint256 _newcap) public virtual
    {
        require(ERC721EnumerableUpgradeable.totalSupply() <= _newcap, "ERC721Capped: cap too low");
        _cap = _newcap;
    }
}
