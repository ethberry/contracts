// SPDX-License-Identifier: UNLICENSED

/*
 * A generalized NoSql-like document storage module
 * For training purposes only.
 * Copyright (c) 2017, Rob Hitchens. All rights reserved.
 */

pragma solidity ^0.8.20;

import "../GeneralizedCollection.sol";

contract GeneralizedCollectionTest is GeneralizedCollection {
  function getRecordCount() public view virtual returns (uint256) {
    return super._getRecordCount();
  }

  function upsertRecordField(uint256 pk, bytes32 fieldKey, uint256 value) public returns (bool) {
    return super._upsertRecordField(pk, fieldKey, value);
  }

  function deleteRecord(uint256 pk) public returns (bool) {
    return super._deleteRecord(pk);
  }

  function deleteRecordField(uint256 pk, bytes32 fieldKey) public returns (bool) {
    return super._deleteRecordField(pk, fieldKey);
  }

  function isRecordFieldKey(uint256 pk, bytes32 fieldKey) public view returns (bool) {
    return super._isRecordFieldKey(pk, fieldKey);
  }

  function getRecordFieldKeyCount(uint256 pk) public view returns (uint256) {
    return super._getRecordFieldKeyCount(pk);
  }

  function isRecord(uint256 pk) public view returns (bool) {
    return super._isRecord(pk);
  }

  function getRecordFieldValue(uint256 pk, bytes32 fieldKey) public view returns (uint256) {
    return super._getRecordFieldValue(pk, fieldKey);
  }
}
