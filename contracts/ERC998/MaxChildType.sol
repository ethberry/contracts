// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MaxChildType {

  uint256 private _defaultMaxChildPerType = 1; // One Item per Hero's slot
  mapping(uint256 /* ItemType */ => uint256 /* MaxChilds */) internal _maxChildTypes;
  mapping(uint256 /* ItemType */ => uint256 /* NumChilds */) internal _numChildTypes;

  event SetMaxChild(uint256 childType, uint256 maxCount);

  function getMaxChild(uint256 childType) public view returns (uint256) {
    if (_maxChildTypes[childType] > 1) {
      return _maxChildTypes[childType];
    }
    return _defaultMaxChildPerType;
  }

  function _setMaxChild(uint256 childType, uint256 max) internal {
    _maxChildTypes[childType] = max;
    emit SetMaxChild(childType, max);
  }

  function incrementChildCount(uint256 childType) public {
    uint256 max = _maxChildTypes[childType] > 0 ? _maxChildTypes[childType] : _defaultMaxChildPerType;
    require(_numChildTypes[childType] < max, "MaxChildType: excess number of child");
    _numChildTypes[childType]++;
  }

  function decrementChildCount(uint256 childType) public {
    if (_numChildTypes[childType] > 0) {
      _numChildTypes[childType]--;
    }
  }

  modifier onlyChildTypeWithIncrement(uint256 childType) {
    incrementChildCount(childType);
    _;
  }

  modifier onlyChildTypeWithDecrement(uint256 childType) {
    decrementChildCount(childType);
    _;
  }
}
