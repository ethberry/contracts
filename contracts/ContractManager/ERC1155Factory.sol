// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC1155Factory is AbstractFactory {
  bytes32 private immutable ERC1155_PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,bytes bytecode,string baseTokenURI,uint256 templateId)");

  address[] private _erc1155_tokens;

  event ERC1155TokenDeployed(address addr, string baseTokenURI, uint256 templateId);

  function deployERC1155Token(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory baseTokenURI,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC1155(nonce, bytecode, baseTokenURI, templateId);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(baseTokenURI));
    _erc1155_tokens.push(addr);

    emit ERC1155TokenDeployed(addr, baseTokenURI, templateId);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hashERC1155(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory baseTokenURI,
    uint256 templateId
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            ERC1155_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            keccak256(abi.encodePacked(baseTokenURI)),
            templateId
          )
        )
      );
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
