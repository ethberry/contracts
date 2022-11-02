// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

interface IERC998TopDown {
  /// @dev This emits when a token receives a child token.
  /// @param from The prior owner of the token.
  /// @param tokenId The token that receives the child token.
  /// @param childContract The contract address of the child token.
  /// @param childTokenId The tokenId of the child.
  /// @param amount child amount.
  event ReceivedChild(
    address indexed from,
    uint256 indexed tokenId,
    address indexed childContract,
    uint256 childTokenId,
    uint256 amount
  );

  /// @dev This emits when a child token is transferred from a token to an address.
  /// @param tokenId The parent token that the child token is being transferred from.
  /// @param to The new owner address of the child token.
  /// @param childContract The contract address of the child token.
  /// @param childTokenId The tokenId of the child.
  /// @param amount child amount.
  event TransferChild(
    uint256 indexed tokenId,
    address indexed to,
    address indexed childContract,
    uint256 childTokenId,
    uint256 amount
  );
}
