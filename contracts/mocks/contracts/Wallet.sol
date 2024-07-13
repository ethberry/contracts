// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { ERC721Holder, IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { ERC1155Holder, IERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import {
  ERC1363Receiver,
  IERC1363Receiver,
  IERC1363Spender
} from "@gemunion/contracts-erc1363/contracts/extensions/ERC1363Receiver.sol";

/**
 * @dev NativeWallet contract can receive NATIVE tokens.
 */
contract NativeWallet {
  receive() external payable virtual {}
}

/**
 * @dev CoinWallet contract can receive NATIVE and ERC20 tokens.
 */
contract CoinWallet is ERC165, ERC1363Receiver, NativeWallet {
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
 * @dev NftWallet contract can receive ERC721, ERC998 tokens.
 */
contract NftWallet is ERC165, ERC721Holder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Receiver).interfaceId || super.supportsInterface(interfaceId);
  }
}

/**
 * @dev SemiCoinWallet contract can receive NATIVE, ERC20 and ERC1155 tokens.
 */
contract SemiCoinWallet is ERC165, NativeWallet, CoinWallet, ERC1155Holder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, ERC1155Holder, CoinWallet) returns (bool) {
    return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
  }
}

/**
 * @dev SemiNftWallet contract can receive ERC721, ERC998 and ERC1155 tokens.
 */
contract SemiNftWallet is ERC165, NftWallet, ERC1155Holder {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, ERC1155Holder, NftWallet) returns (bool) {
    return
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}

/**
 * @dev NotNativeWallet contract can receive ERC20, ERC721, ERC998 and ERC1155 tokens.
 */
contract NotNativeDto is CoinWallet, SemiNftWallet {
  /**
   * @notice No tipping!
   * @dev Rejects any incoming ETH transfers
   */
  receive() external payable override {
    revert();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(CoinWallet, SemiNftWallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

/**
 * @dev AllTypesWallet contract can receive NATIVE, ERC20, ERC721, ERC998 and ERC1155 tokens.
 */
contract AllTypesWallet is CoinWallet, SemiNftWallet {
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(CoinWallet, SemiNftWallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
