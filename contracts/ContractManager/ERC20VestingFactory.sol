// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC20VestingFactory is AbstractFactory {
  bytes32 private immutable VESTING_PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,bytes bytecode,address beneficiary,uint64 startTimestamp,uint64 duration)");

  address[] private _vesting;

  event VestingDeployed(
    address addr,
    address beneficiary,
    uint64 startTimestamp, // in seconds
    uint64 duration // in seconds
  );

  function deployERC20Vesting(
    bytes32 nonce,
    bytes calldata bytecode,
    address beneficiary,
    uint64 startTimestamp,
    uint64 duration,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address token) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hash(nonce, bytecode, beneficiary, startTimestamp, duration);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    token = deploy(bytecode, abi.encode(beneficiary, startTimestamp, duration));
    _vesting.push(token);

    emit VestingDeployed(token, beneficiary, startTimestamp, duration);
  }

  function _hash(
    bytes32 nonce,
    bytes calldata bytecode,
    address beneficiary,
    uint64 startTimestamp,
    uint64 duration
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            VESTING_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            beneficiary,
            startTimestamp,
            duration
          )
        )
      );
  }

  function allVesting() external view returns (address[] memory) {
    return _vesting;
  }
}
