// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MaxChildType {

  uint256 private _defaultMaxChildPerClass = 1; // One Item per Hero's slot
  mapping(uint256 /* ItemClass */ => uint256 /* Max Child */) internal _maxChildClass;
  mapping(uint256 /* ItemClass */ => uint256 /* Num Child */) internal _numChildClass;

  event SetMaxChild(uint256 childClass, uint256 maxCount);

  bytes4 constant CHILD_CLASS = bytes4(keccak256("getClassByTokenId(uint256)"));

  function getMaxChild(uint256 childClass) public view returns (uint256) {
    if (_maxChildClass[childClass] > 1) {
      return _maxChildClass[childClass];
    }
    return _defaultMaxChildPerClass;
  }

  function _setMaxChild(uint256 childClass, uint256 max) internal {
    _maxChildClass[childClass] = max;
    emit SetMaxChild(childClass, max);
  }

  function incrementChildCount(address addr, uint256 tokenId) public {
    uint256 childClass = classOfChild(addr, tokenId);
    uint256 max = _maxChildClass[childClass] > 0 ? _maxChildClass[childClass] : _defaultMaxChildPerClass;
    require(_numChildClass[childClass] < max, "MaxChildType: excess number of child");
    _numChildClass[childClass]++;
  }

  function decrementChildCount(address addr, uint256 tokenId) public {
    uint256 childClass = classOfChild(addr, tokenId);
    if (_numChildClass[childClass] > 0) {
      _numChildClass[childClass]--;
    }
  }

  modifier onlyChildClassWithIncrement(address addr, uint256 tokenId) {
    incrementChildCount(addr, tokenId);
    _;
  }

  modifier onlyChildClassWithDecrement(address addr, uint256 tokenId) {
    decrementChildCount(addr, tokenId);
    _;
  }

  // returns item class of child token
  function classOfChild(address _childContract, uint256 _childTokenId)
  public
  view
  returns (uint256 childClass)
  {
      bytes memory callData = abi.encodeWithSelector(CHILD_CLASS, _childTokenId);
      address childAddress_ = _childContract;
      (bool callSuccess, bytes memory data) = childAddress_.staticcall(callData);
      require(callSuccess, "MaxChildClass: getClass failed");
      assembly {
        childClass := mload(add(data, 0x20))
      }
  }

}
