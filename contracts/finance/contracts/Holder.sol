// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gmail.com
// Website: https://ethberry.io/

pragma solidity ^0.8.20;

import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { ERC721Holder, IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { ERC1155Holder, IERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

import {
  ERC1363Receiver,
  IERC1363Receiver,
  IERC1363Spender
} from "@ethberry/contracts-erc1363/contracts/extensions/ERC1363Receiver.sol";

/**
 * @dev NativeReceiver contract receives NATIVE tokens.
 */
abstract contract NativeReceiver is Context {
  event PaymentReceived(address from, uint256 amount);

  receive() external payable virtual {
    emit PaymentReceived(_msgSender(), msg.value);
  }
}

/**
 * @dev NativeRejector contract rejects NATIVE tokens.
 */
abstract contract NativeRejector is Context {
  error PaymentRejected(address from, uint256 amount);
  /**
   * @notice No tipping!
   * @dev Rejects any incoming ETH transfers
   */
  receive() external payable virtual {
    revert PaymentRejected(_msgSender(), msg.value);
  }
}

/**
 * @dev CoinHolder contract can receive ERC20 and ERC1363 tokens.
 */
abstract contract CoinHolder is ERC165, ERC1363Receiver {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC1363Receiver).interfaceId ||
      interfaceId == type(IERC1363Spender).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}

/**
 * @dev NftHolder contract can receive ERC721, ERC998 tokens.
 */
abstract contract NftHolder is ERC165, ERC721Holder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Receiver).interfaceId || super.supportsInterface(interfaceId);
  }
}

/**
 * @dev SemiCoinHolder contract can receive ERC20 and ERC1155 tokens.
 */
abstract contract SemiCoinHolder is CoinHolder, ERC1155Holder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(CoinHolder, ERC1155Holder) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

/**
 * @dev SemiNftHolder contract can receive ERC721, ERC998 and ERC1155 tokens.
 */
abstract contract SemiNftHolder is NftHolder, ERC1155Holder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(NftHolder, ERC1155Holder) returns (bool) {
    return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
  }
}

/**
 * @dev AllTypesHolder contract can receive ERC20, ERC721, ERC998 and ERC1155 tokens.
 */
abstract contract AllTypesHolder is CoinHolder, SemiNftHolder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(CoinHolder, SemiNftHolder) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
