// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721TradableUpgradeable is IERC721EnumerableUpgradeable {
    function cap() external view returns (uint256);
    function mint(address to) external;
}
