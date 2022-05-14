// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AbstractFactory is AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  function deploy(bytes calldata bytecode, bytes memory arguments) internal returns (address addr) {
    bytes memory _bytecode = abi.encodePacked(bytecode, arguments);

    assembly {
      addr := create(0, add(_bytecode, 0x20), mload(_bytecode))
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }
  }

  function fixPermissions(address addr, bytes32[] memory roles) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < roles.length; i++) {
      instance.grantRole(roles[i], _msgSender());
      instance.renounceRole(roles[i], address(this));
    }
  }
}
