// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (interfaces/IERC1363.sol)

pragma solidity ^0.8.20;

import { IERC1363Receiver } from "../interfaces/IERC1363Receiver.sol";
import { IERC1363Spender } from "../interfaces/IERC1363Spender.sol";

/**
 * @dev Implementation of the {IERC1363Receiver} and {IERC1363Spender} interfaces.
 * Allows to receive ERC1363 token transfers, and receive and approve them spending on behalf of the token owner.
 */
contract ERC1363Receiver is IERC1363Receiver, IERC1363Spender {
  event TransferReceived(address operator, address from, uint256 value, bytes data);
  event ApprovalReceived(address owner, uint256 value, bytes data);

  /**
   * @dev Called by a sender to notify the receiver of the transfer.
   * @param operator The address of the operator performing the transfer.
   * @param from The address of the sender.
   * @param value The amount being transferred.
   * @param data Additional data with no specified format.
   * @return bytes4 selector of onTransferReceived function
   *                unless throwing
   */
  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes memory data
  ) external override returns (bytes4) {
    emit TransferReceived(operator, from, value, data);
    return this.onTransferReceived.selector;
  }

  /**
   * @dev Called by a sender to notify the receiver of the approval.
   * @param owner The address of the owner providing the allowance.
   * @param value The new allowance.
   * @param data Additional data with no specified format.
   * @return bytes4 selector of onApprovalReceived function
   *                unless throwing
   */
  function onApprovalReceived(address owner, uint256 value, bytes memory data) external override returns (bytes4) {
    emit ApprovalReceived(owner, value, data);
    return this.onApprovalReceived.selector;
  }
}
