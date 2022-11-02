// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/// @title ERC998ERC721 Top-Down Composable Non-Fungible Token
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-998.md
///  Note: the ERC-165 identifier for this interface is 0x1efdf36a
interface IERC998ERC721TopDown is IERC721Receiver {
  /// @notice Get the root owner of tokenId.
  /// @param tokenId The token to query for a root owner address
  /// @return rootOwner The root owner at the top of tree of tokens and ERC998 magic value.
  function rootOwnerOf(uint256 tokenId) external view returns (bytes32 rootOwner);

  /// @notice Get the root owner of a child token.
  /// @param childContract The contract address of the child token.
  /// @param childTokenId The tokenId of the child.
  /// @return rootOwner The root owner at the top of tree of tokens and ERC998 magic value.
  function rootOwnerOfChild(address childContract, uint256 childTokenId) external view returns (bytes32 rootOwner);

  /// @notice Get the parent tokenId of a child token.
  /// @param childContract The contract address of the child token.
  /// @param childTokenId The tokenId of the child.
  /// @return parentTokenOwner The parent address of the parent token and ERC998 magic value
  /// @return parentTokenId The parent tokenId of tokenId
  function ownerOfChild(address childContract, uint256 childTokenId)
    external
    view
    returns (bytes32 parentTokenOwner, uint256 parentTokenId);

  /// @notice Transfer child token from top-down composable to address.
  /// @param fromTokenId The owning token to transfer from.
  /// @param to The address that receives the child token
  /// @param childContract The ERC721 contract of the child token.
  /// @param childTokenId The tokenId of the token that is being transferred.
  function transferChild(uint256 fromTokenId, address to, address childContract, uint256 childTokenId) external;

  /// @notice Transfer child token from top-down composable to address.
  /// @param fromTokenId The owning token to transfer from.
  /// @param to The address that receives the child token
  /// @param childContract The ERC721 contract of the child token.
  /// @param childTokenId The tokenId of the token that is being transferred.
  function safeTransferChild(uint256 fromTokenId, address to, address childContract, uint256 childTokenId) external;

  /// @notice Transfer child token from top-down composable to address.
  /// @param fromTokenId The owning token to transfer from.
  /// @param to The address that receives the child token
  /// @param childContract The ERC721 contract of the child token.
  /// @param childTokenId The tokenId of the token that is being transferred.
  /// @param data Additional data with no specified format
  function safeTransferChild(
    uint256 fromTokenId,
    address to,
    address childContract,
    uint256 childTokenId,
    bytes memory data
  ) external;

  /// @notice Transfer bottom-up composable child token from top-down composable to other ERC721 token.
  /// @param fromTokenId The owning token to transfer from.
  /// @param toContract The ERC721 contract of the receiving token
  /// @param toTokenId The receiving token
  /// @param childContract The bottom-up composable contract of the child token.
  /// @param childTokenId The token that is being transferred.
  /// @param data Additional data with no specified format
  function transferChildToParent(
    uint256 fromTokenId,
    address toContract,
    uint256 toTokenId,
    address childContract,
    uint256 childTokenId,
    bytes memory data
  ) external;

  /// @notice Get a child token from an ERC721 contract.
  /// @param from The address that owns the child token.
  /// @param tokenId The token that becomes the parent owner
  /// @param childContract The ERC721 contract of the child token
  /// @param childTokenId The tokenId of the child token
  function getChild(address from, uint256 tokenId, address childContract, uint256 childTokenId) external;
}
