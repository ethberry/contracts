// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

interface IStateHash {
  function stateHash(uint256 tokenId) external view returns (bytes32);
}
