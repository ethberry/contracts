// SPDX-License-Identifier: UNLICENSED

/*
 * A generalized NoSql-like document storage module
 * For training purposes only.
 * Copyright (c) 2017, Rob Hitchens. All rights reserved.
 */

pragma solidity ^0.8.20;

import "./interfaces/IGeneralizedCollectionErrors.sol";

contract GeneralizedCollection is IGeneralizedCollectionErrors {
  // Each field includes a value and a pointer to the fieldKeyIndex

  struct FieldStruct {
    uint256 value;
    uint256 fieldKeyListPointer;
  }

  // Each record supports enumerating key/value pairs stored

  struct RecordStruct {
    mapping(bytes32 => FieldStruct) fieldStructs;
    bytes32[] fieldKeyList;
    uint256 recordListPointer;
  }

  // Each collection supports enumerating the primary keys stored

  mapping(uint256 => RecordStruct) internal recordStructs;
  uint256[] private recordList;

  // Count records in the collection

  function _getRecordCount() internal view virtual returns (uint256) {
    return recordList.length;
  }

  // Count fields in a record

  function _getRecordFieldKeyCount(uint256 pk) internal view virtual returns (uint256) {
    if (!_isRecord(pk)) {
      revert RecordNotFound(pk);
    }

    return (recordStructs[pk].fieldKeyList.length);
  }

  // Check a primary key

  function _isRecord(uint256 pk) internal view virtual returns (bool) {
    if (recordList.length == 0) {
      return false;
    }

    return recordList[recordStructs[pk].recordListPointer] == pk;
  }

  // Check a field key in a specific record

  function _isRecordFieldKey(uint256 pk, bytes32 fieldKey) internal view virtual returns (bool) {
    if (!_isRecord(pk)) {
      return false;
    }

    if (_getRecordFieldKeyCount(pk) == 0) {
      return false;
    }

    return recordStructs[pk].fieldKeyList[recordStructs[pk].fieldStructs[fieldKey].fieldKeyListPointer] == fieldKey;
  }

  // Insert a primary key. Field count defaults to 0.

  function _insertRecord(uint256 pk) internal returns (bool) {
    if (_isRecord(pk)) {
      revert RecordAlreadyExist(pk);
    }

    recordList.push(pk);
    recordStructs[pk].recordListPointer = recordList.length - 1;
    return true;
  }

  // Insert a field key in a specific record. Value default to 0x0

  function _insertRecordField(uint256 pk, bytes32 fieldKey) internal returns (bool) {
    if (!_isRecord(pk)) {
      revert RecordNotFound(pk);
    }

    if (_isRecordFieldKey(pk, fieldKey)){
      revert FieldAlreadySet(pk, fieldKey);
    }

    recordStructs[pk].fieldKeyList.push(fieldKey);
    recordStructs[pk].fieldStructs[fieldKey].fieldKeyListPointer = recordStructs[pk].fieldKeyList.length - 1;
    return true;
  }

  // Set a field key value in a specific record. Insert the primary key and/or field key if needed.

  function _upsertRecordField(uint256 pk, bytes32 fieldKey, uint256 value) internal returns (bool) {
    if (!_isRecord(pk)) {
      _insertRecord(pk);
    }

    if (!_isRecordFieldKey(pk, fieldKey)) {
      _insertRecordField(pk, fieldKey);
    }

    recordStructs[pk].fieldStructs[fieldKey].value = value;
    return true;
  }

  // Get a field key value from a specific record

  function _getRecordFieldValue(uint256 pk, bytes32 fieldKey) internal view virtual returns (uint256) {
    if (!_isRecordFieldKey(pk, fieldKey)) {
      revert FieldNotFound(pk, fieldKey);
    }

    return recordStructs[pk].fieldStructs[fieldKey].value;
  }

  // Delete a complete record. Useful for reducing list size.

  function _deleteRecord(uint256 pk) internal returns (bool) {
    if (!_isRecord(pk)) {
      revert RecordNotFound(pk);
    }

    uint256 rowToDelete = recordStructs[pk].recordListPointer;
    uint256 keyToMove = recordList[recordList.length - 1];

    recordStructs[keyToMove].recordListPointer = rowToDelete;
    recordList[rowToDelete] = keyToMove;
    recordList.pop();

    delete recordStructs[pk].fieldKeyList;
    return true;
  }

  // Delete a field key/value from a record. Useful for reducing list size.

  function _deleteRecordField(uint256 pk, bytes32 fieldKey) internal returns (bool) {
    if (!_isRecordFieldKey(pk, fieldKey)) {
      revert FieldNotFound(pk, fieldKey);
    }

    uint256 rowToDelete = recordStructs[pk].fieldStructs[fieldKey].fieldKeyListPointer;
    uint256 recordFieldCount = recordStructs[pk].fieldKeyList.length;
    bytes32 keyToMove = recordStructs[pk].fieldKeyList[recordFieldCount - 1];
    recordStructs[pk].fieldStructs[keyToMove].fieldKeyListPointer = rowToDelete;
    recordStructs[pk].fieldKeyList[rowToDelete] = keyToMove;
    recordStructs[pk].fieldKeyList.pop();
    return true;
  }
}
