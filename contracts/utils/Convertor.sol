// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

contract Convertor {
  function bytes4ToBytes(bytes4 _data) public pure returns (bytes memory) {
    return abi.encodePacked(_data);
  }

  function bytes32ToBytes(bytes32 _data) public pure returns (bytes memory) {
    return abi.encodePacked(_data);
  }
}
