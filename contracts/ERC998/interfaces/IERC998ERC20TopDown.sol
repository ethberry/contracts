// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IERC998ERC20TopDown {
  event ReceivedERC20(address indexed from, uint256 indexed tokenId, address indexed erc20Contract, uint256 value);

  event TransferERC20(uint256 indexed tokenId, address indexed to, address indexed erc20Contract, uint256 value);

  function tokenFallback(
    address from,
    uint256 value,
    bytes memory data
  ) external;

  function balanceOfERC20(uint256 tokenId, address erc20Contract) external view returns (uint256);

  function transferERC20(
    uint256 tokenId,
    address to,
    address erc20Contract,
    uint256 value
  ) external;

  function transferERC223(
    uint256 tokenId,
    address to,
    address erc223Contract,
    uint256 value,
    bytes memory data
  ) external;

  function getERC20(
    address from,
    uint256 tokenId,
    address erc20Contract,
    uint256 value
  ) external;
}
