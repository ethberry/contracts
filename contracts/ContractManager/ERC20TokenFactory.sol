// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./AbstractFactory.sol";

contract ERC20TokenFactory is AbstractFactory {
  bytes32 private immutable ERC20_PERMIT_SIGNATURE =
  keccak256("EIP712(bytes32 nonce,bytes bytecode,string name,string symbol,uint256 cap)");

  address[] private _erc20_tokens;

  event ERC20TokenDeployed(address addr, string name, string symbol, uint256 cap);

  function deployERC20Token(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    uint256 cap,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hash(nonce, bytecode, name, symbol, cap);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(name, symbol, cap));
    _erc20_tokens.push(addr);

    emit ERC20TokenDeployed(addr, name, symbol, cap);

    bytes32[] memory roles = new bytes32[](3);
    roles[0] = MINTER_ROLE;
    roles[1] = SNAPSHOT_ROLE;
    roles[2] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hash(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    uint256 cap
  ) internal view returns (bytes32) {
    return
    _hashTypedDataV4(
      keccak256(
        abi.encode(
          ERC20_PERMIT_SIGNATURE,
          nonce,
          keccak256(abi.encodePacked(bytecode)),
          keccak256(abi.encodePacked(name)),
          keccak256(abi.encodePacked(symbol)),
          cap
        )
      )
    );
  }

  function allERC20Tokens() external view returns (address[] memory) {
    return _erc20_tokens;
  }
}
