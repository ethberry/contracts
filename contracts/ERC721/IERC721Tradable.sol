// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721Tradable is IERC721Enumerable {
    function cap() external view returns (uint256);
    function mint(address to) external;
    function mintTo(address to) external;
}
