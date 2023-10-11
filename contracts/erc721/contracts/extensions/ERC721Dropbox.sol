// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

abstract contract ERC721Dropbox is ERC721, EIP712 {
  mapping(bytes32 => bool) private _expired;

  event Redeem(address account, uint256 tokenId);

  constructor(string memory name) EIP712(name, "1.0.0") {}

  function _redeem(bytes32 nonce, address account, uint256 tokenId, address signer, bytes calldata signature) internal {
    require(_verify(signer, _hash(nonce, account, tokenId), signature), "ERC721Dropbox: Invalid signature");

    require(!_expired[nonce], "ERC721Dropbox: Expired signature");
    _expired[nonce] = true;

    _safeMint(account, tokenId);
    emit Redeem(account, tokenId);
  }

  function _hash(bytes32 nonce, address account, uint256 tokenId) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(keccak256("EIP712(bytes32 nonce,address account,uint256 tokenId)"), nonce, account, tokenId)
        )
      );
  }

  function _verify(address signer, bytes32 digest, bytes memory signature) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }
}
