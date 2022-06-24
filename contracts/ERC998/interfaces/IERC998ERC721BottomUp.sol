// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

/// @title ERC998ERC721 Bottom-Up Composable Non-Fungible Token
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-998.md
///  Note: the ERC-165 identifier for this interface is 0xa1b23002
interface IERC998ERC721BottomUp {
  /// @dev This emits when a token is transferred to an ERC721 token
  /// @param toContract The contract the token is transferred to
  /// @param toTokenId The token the token is transferred to
  /// @param tokenId The token that is transferred
  event TransferToParent(address indexed toContract, uint256 indexed toTokenId, uint256 tokenId);

  /// @dev This emits when a token is transferred from an ERC721 token
  /// @param fromContract The contract the token is transferred from
  /// @param fromTokenId The token the token is transferred from
  /// @param tokenId The token that is transferred
  event TransferFromParent(address indexed fromContract, uint256 indexed fromTokenId, uint256 tokenId);

  /// @notice Get the root owner of tokenId.
  /// @param tokenId The token to query for a root owner address
  /// @return rootOwner The root owner at the top of tree of tokens and ERC998 magic value.
  function rootOwnerOf(uint256 tokenId) external view returns (bytes32 rootOwner);

  /// @notice Get the owner address and parent token (if there is one) of a token
  /// @param tokenId The tokenId to query.
  /// @return tokenOwner The owner address of the token
  /// @return parentTokenId The parent owner of the token and ERC998 magic value
  /// @return isParent True if parentTokenId is a valid parent tokenId and false if there is no parent tokenId
  function tokenOwnerOf(uint256 tokenId)
    external
    view
    returns (
      bytes32 tokenOwner,
      uint256 parentTokenId,
      bool isParent
    );

  /// @notice Transfer token from owner address to a token
  /// @param from The owner address
  /// @param toContract The ERC721 contract of the receiving token
  /// @param toTokenId The receiving token
  /// @param tokenId The token that is transferred
  /// @param data Additional data with no specified format
  function transferToParent(
    address from,
    address toContract,
    uint256 toTokenId,
    uint256 tokenId,
    bytes memory data
  ) external;

  /// @notice Transfer token from a token to an address
  /// @param fromContract The address of the owning contract
  /// @param fromTokenId The owning token
  /// @param to The address the token is transferred to.
  /// @param tokenId The token that is transferred
  /// @param data Additional data with no specified format
  function transferFromParent(
    address fromContract,
    uint256 fromTokenId,
    address to,
    uint256 tokenId,
    bytes memory data
  ) external;

  /// @notice Transfer a token from a token to another token
  /// @param fromContract The address of the owning contract
  /// @param fromTokenId The owning token
  /// @param toContract The ERC721 contract of the receiving token
  /// @param toTokenId The receiving token
  /// @param tokenId The token that is transferred
  /// @param data Additional data with no specified format
  function transferAsChild(
    address fromContract,
    uint256 fromTokenId,
    address toContract,
    uint256 toTokenId,
    uint256 tokenId,
    bytes memory data
  ) external;
}
