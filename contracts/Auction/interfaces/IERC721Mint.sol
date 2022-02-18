// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IERC721Mint {
  function mint(address to, uint256 tokenId) external;
}
