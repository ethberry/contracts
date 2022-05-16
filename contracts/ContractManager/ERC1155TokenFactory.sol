// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC1155TokenFactory is AbstractFactory {
  bytes32 private immutable ERC1155_PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,bytes bytecode,string baseTokenURI)");

  address[] private _erc1155_tokens;

  event ERC1155TokenDeployed(address addr, string baseTokenURI);

  function deployERC1155Token(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory baseTokenURI,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hash(nonce, bytecode, baseTokenURI);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(baseTokenURI));
    _erc1155_tokens.push(addr);

    emit ERC1155TokenDeployed(addr, baseTokenURI);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hash(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory baseTokenURI
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            ERC1155_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            keccak256(abi.encodePacked(baseTokenURI))
          )
        )
      );
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
