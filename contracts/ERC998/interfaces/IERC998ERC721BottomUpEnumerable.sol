// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IERC998ERC721BottomUpEnumerable {
  function totalChildTokens(address parentContract, uint256 parentTokenId) external view returns (uint256);

  function childTokenByIndex(
    address parentContract,
    uint256 parentTokenId,
    uint256 index
  ) external view returns (uint256);
}
