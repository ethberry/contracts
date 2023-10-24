// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

import {IERC1363} from "@gemunion/contracts-erc1363/contracts/interfaces/IERC1363.sol";
import {IERC1363_ID, IERC1363_RECEIVER_ID} from "@gemunion/contracts-utils/contracts/interfaces.sol";

contract ExchangeMock is Context {
  using SafeERC20 for IERC20;

  function spendFrom(
    address receiver,
    address token,
    uint256 amount
  ) public {
    if (_isERC1363Supported(receiver, token)) {
      IERC1363(token).transferFromAndCall(_msgSender(), receiver, amount);
    } else {
      SafeERC20.safeTransferFrom(IERC20(token), _msgSender(), receiver, amount);
    }
  }

  function _isERC1363Supported(address receiver, address token) internal view returns (bool) {
    return
      (receiver == address(this) ||
        (receiver.code.length != 0 && _tryGetSupportedInterface(receiver, IERC1363_RECEIVER_ID))) &&
      _tryGetSupportedInterface(token, IERC1363_ID);
  }

  function _tryGetSupportedInterface(address account, bytes4 interfaceId) internal view returns (bool) {
    try IERC165(account).supportsInterface(interfaceId) returns (bool isSupported) {
      return isSupported;
    } catch (bytes memory) {
      return false;
    }
  }
}
