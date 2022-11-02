// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

interface IERC998ERC721TopDownEnumerable {
  function totalChildContracts(uint256 tokenId) external view returns (uint256);

  // @notice Get child contract by tokenId and index
  // @param tokenId The parent token of child tokens in child contract
  // @param index The index position of the child contract
  // @return childContract The contract found at the tokenId and index.
  function childContractByIndex(uint256 tokenId, uint256 index) external view returns (address childContract);

  // @notice Get the total number of child tokens owned by tokenId that exist in a child contract.
  // @param tokenId The parent token of child tokens
  // @param childContract The child contract containing the child tokens
  // @return uint256 The total number of child tokens found in child contract that are owned by tokenId.
  function totalChildTokens(uint256 tokenId, address childContract) external view returns (uint256);

  // @notice Get child token owned by tokenId, in child contract, at index position
  // @param tokenId The parent token of the child token
  // @param childContract The child contract of the child token
  // @param index The index position of the child token.
  // @return childTokenId The child tokenId for the parent token, child token and index
  function childTokenByIndex(
    uint256 tokenId,
    address childContract,
    uint256 index
  ) external view returns (uint256 childTokenId);
}
