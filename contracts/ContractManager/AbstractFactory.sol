// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

abstract contract AbstractFactory is EIP712, AccessControl {
  mapping(bytes32 => bool) private _expired;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
  bytes32 public constant METADATA_ADMIN_ROLE = keccak256("METADATA_ADMIN_ROLE");

  address[] _minters;
  address[] _manipulators;

  constructor() EIP712("ContractManager", "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deploy(bytes calldata bytecode, bytes memory arguments) internal returns (address addr) {
    bytes memory _bytecode = abi.encodePacked(bytecode, arguments);

    assembly {
      addr := create(0, add(_bytecode, 0x20), mload(_bytecode))
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }
  }

  function setFactories(address[] memory minters, address[] memory manipulators) public onlyRole(DEFAULT_ADMIN_ROLE) {
  _minters=minters;
  _manipulators=manipulators;
  }

  function grantFactoryMintPermission(address addr) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < _minters.length; i++) {
        instance.grantRole(MINTER_ROLE, _minters[i]);
      }
  }

  function grantFactoryMetadataPermission(address addr) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < _minters.length; i++) {
      instance.grantRole(METADATA_ADMIN_ROLE, _minters[i]);
    }
  }

  function fixPermissions(address addr, bytes32[] memory roles) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < roles.length; i++) {
      instance.grantRole(roles[i], _msgSender());
      instance.renounceRole(roles[i], address(this));
    }
  }

  function _checkSignature(
    address signer,
    bytes32 digest,
    bytes calldata signature
  ) internal view {
    require(_verify(signer, digest, signature), "ContractManager: Invalid signature");
  }

  function _checkNonce(bytes32 nonce) internal {
    require(!_expired[nonce], "ContractManager: Expired signature");
    _expired[nonce] = true;
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }
}
