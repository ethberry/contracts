// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC1155Factory is AbstractFactory {
  bytes32 private immutable ERC1155_PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,bytes bytecode,uint96 royalty,string baseTokenURI,uint8[] featureIds)");

  address[] private _erc1155_tokens;

  event ERC1155TokenDeployed(address addr, uint96 royalty, string baseTokenURI, uint8[] featureIds);

  function deployERC1155Token(
    bytes32 nonce,
    bytes calldata bytecode,
    uint96 royalty,
    string memory baseTokenURI,
    uint8[] calldata featureIds,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC1155(nonce, bytecode, royalty, baseTokenURI, featureIds);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(royalty, baseTokenURI));
    _erc1155_tokens.push(addr);

    emit ERC1155TokenDeployed(addr, royalty, baseTokenURI, featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC1155(
    bytes32 nonce,
    bytes calldata bytecode,
    uint96 royalty,
    string memory baseTokenURI,
    uint8[] calldata featureIds
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            ERC1155_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            royalty,
            keccak256(abi.encodePacked(baseTokenURI)),
            keccak256(abi.encodePacked(featureIds))
          )
        )
      );
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
