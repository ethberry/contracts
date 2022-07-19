// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract VestingFactory is AbstractFactory {
  bytes32 private immutable VESTING_PERMIT_SIGNATURE =
    keccak256(
      "EIP712(bytes32 nonce,bytes bytecode,address account,uint64 startTimestamp,uint64 duration,uint256 templateId)"
    );

  address[] private _erc20_vesting;

  event VestingDeployed(
    address addr,
    address account,
    uint64 startTimestamp, // in seconds
    uint64 duration, // in seconds
    uint256 templateId
  );

  function deployVesting(
    bytes32 nonce,
    bytes calldata bytecode,
    address account,
    uint64 startTimestamp,
    uint64 duration,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hash(nonce, bytecode, account, startTimestamp, duration, templateId);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(account, startTimestamp, duration));
    _erc20_vesting.push(addr);

    emit VestingDeployed(addr, account, startTimestamp, duration, templateId);
  }

  function _hash(
    bytes32 nonce,
    bytes calldata bytecode,
    address account,
    uint64 startTimestamp,
    uint64 duration,
    uint256 templateId
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            VESTING_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            account,
            startTimestamp,
            duration,
            templateId
          )
        )
      );
  }

  function allVesting() external view returns (address[] memory) {
    return _erc20_vesting;
  }
}
