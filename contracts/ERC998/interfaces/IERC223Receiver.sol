// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IERC223Receiver {
  /**
   * @dev Standard ERC223 function that will handle incoming token transfers.
   *
   * @param from  Token sender address.
   * @param value Amount of tokens.
   * @param data  Transaction metadata.
   */
  function tokenFallback(
    address from,
    uint256 value,
    bytes memory data
  ) external;
}
