// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

interface IERC998ERC1155TopDown {
  event BatchTransferChild(
    uint256 indexed tokenId,
    address indexed to,
    address indexed childContract,
    uint256[] childTokenIds,
    uint256[] amounts
  );

  event BatchReceivedChild(
    address indexed from,
    uint256 indexed tokenId,
    address indexed childContract,
    uint256[] childTokenIds,
    uint256[] amounts
  );

  /**
   * @dev See {IERC1155-safeTransferFrom}.
   */
  function safeTransferFromERC1155(
    uint256 _fromTokenId,
    address _to,
    address _erc1155Contract,
    uint256 _childTokenId,
    uint256 _amount,
    bytes memory _data
  ) external;

  /**
   * @dev See {IERC1155-safeBatchTransferFrom}.
   */
  function safeBatchTransferFromERC1155(
    uint256 _fromTokenId,
    address _to,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory _amounts,
    bytes memory _data
  ) external;

  /**
   * @dev See {IERC1155-balanceOf}.
   */
  function balanceOfERC1155(uint256 _tokenId, address _erc1155Contract, uint256 childTokenId)
    external
    view
    returns (uint256);

  /**
   * @dev See {IERC1155-balanceOfBatch}.
   */
  function balanceOfBatchERC1155(uint256[] memory _tokenIds, address _erc1155Contract, uint256[] memory childTokenIds)
    external
    view
    returns (uint256[] memory);
}
