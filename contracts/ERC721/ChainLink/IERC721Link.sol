// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721Link is IERC721Enumerable {
    function mintRandom() external;
}
