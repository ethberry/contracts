// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

abstract contract ERC721DropboxAll is EIP712 {
  // tokenId => dropType
  mapping(uint256 => uint256) internal _dropType;
  // tokenId => tokenType
  mapping(uint256 => uint256) internal _tokenType;

  constructor(string memory name) EIP712(name, "1.0.0") {}

  function _safeMint(address account, uint256 tokenId) internal virtual;

  function _redeem(
    address to,
    uint256 tokenId,
    uint256 dropType,
    uint256 tokenType,
    address signer,
    bytes calldata signature
  ) internal {
    require(_verify(signer, _hash(to, tokenId, dropType, tokenType), signature), "ERC721Dropbox: Invalid signature");
    _dropType[tokenId] = dropType;
    _tokenType[tokenId] = tokenType;
    _safeMint(to, tokenId);
  }

  function _hash(address account, uint256 tokenId, uint256 dropType, uint256 tokenType) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(keccak256("NFT(address account,uint256 tokenId,uint256 dropType,uint256 tokenType)"), account, tokenId, dropType, tokenType)));
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }
}
