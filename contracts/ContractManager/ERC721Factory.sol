// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC721Factory is AbstractFactory {
  bytes32 private immutable ERC721_PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,bytes bytecode,string name,string symbol,string baseTokenURI,uint96 royalty)");

  address[] private _erc721_tokens;

  event ERC721Deployed(address token, string name, string symbol, string baseTokenURI, uint96 royalty);

  function deployERC721Token(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royalty,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address token) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hash(nonce, bytecode, name, symbol, baseTokenURI, royalty);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    token = deploy(bytecode, abi.encode(name, symbol, baseTokenURI, royalty));
    _erc721_tokens.push(token);

    emit ERC721Deployed(token, name, symbol, baseTokenURI, royalty);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(token, roles);
  }

  function _hash(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royalty
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            ERC721_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            keccak256(abi.encodePacked(name)),
            keccak256(abi.encodePacked(symbol)),
            keccak256(abi.encodePacked(baseTokenURI)),
            royalty
          )
        )
      );
  }

  function allERC721Tokens() external view returns (address[] memory) {
    return _erc721_tokens;
  }
}
