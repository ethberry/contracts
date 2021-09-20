// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IERC721VerifiableUpgradeable is IERC721Upgradeable {
    function verifyFingerprint(uint256, bytes memory) external view returns (bool);
}