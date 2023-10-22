// SPDX-License-Identifier: UNLICENSED


pragma solidity ^0.8.20;

interface IERC721GeneralizedCollection {
  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  function getTokenMetadata(uint256 tokenId) external view returns (Metadata[] memory);

  function getRecordFieldValue(uint256 pk, bytes32 fieldKey) external view returns (uint256);
}
