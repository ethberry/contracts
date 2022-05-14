// SPDX-License-Identifier: UNLICENSED

/*
 * A generalized NoSql-like document storage module
 * For training purposes only.
 * Copyright (c) 2017, Rob Hitchens. All rights reserved.
 */

pragma solidity ^0.8.4;

contract GeneralizedCollection {
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

  function getRecordCount() public view returns (uint256 recordCount) {
    return recordList.length;
  }

  // Count fields in a record

  function getRecordFieldKeyCount(uint256 pk) public view returns (uint256 keyCount) {
    require(isRecord(pk), "GC: record not found");
    return (recordStructs[pk].fieldKeyList.length);
  }

  // Check a primary key

  function isRecord(uint256 pk) public view returns (bool) {
    if (recordList.length == 0) {
      return false;
    }
    return recordList[recordStructs[pk].recordListPointer] == pk;
  }

  // Check a field key in a specific record

  function isRecordFieldKey(uint256 pk, bytes32 fieldKey) public view returns (bool isIndeed) {
    if (!isRecord(pk)) {
      return false;
    }
    if (getRecordFieldKeyCount(pk) == 0) {
      return false;
    }
    return recordStructs[pk].fieldKeyList[recordStructs[pk].fieldStructs[fieldKey].fieldKeyListPointer] == fieldKey;
  }

  // Insert a primary key. Field count defaults to 0.

  function insertRecord(uint256 pk) internal returns (bool) {
    require(!isRecord(pk), "GC: record already exists");
    recordList.push(pk);
    recordStructs[pk].recordListPointer = recordList.length - 1;
    return true;
  }

  // Insert a field key in a specific record. Value default to 0x0

  function insertRecordField(uint256 pk, bytes32 fieldKey) internal returns (bool) {
    require(isRecord(pk), "GC: record not found");
    require(!isRecordFieldKey(pk, fieldKey), "GC: field already set");
    recordStructs[pk].fieldKeyList.push(fieldKey);
    recordStructs[pk].fieldStructs[fieldKey].fieldKeyListPointer = recordStructs[pk].fieldKeyList.length - 1;
    return true;
  }

  // Set a field key value in a specific record. Insert the primary key and/or field key if needed.

  function upsertRecordField(
    uint256 pk,
    bytes32 fieldKey,
    uint256 value
  ) internal returns (bool) {
    if (!isRecord(pk)) {
      insertRecord(pk);
    }
    if (!isRecordFieldKey(pk, fieldKey)) {
      insertRecordField(pk, fieldKey);
    }
    recordStructs[pk].fieldStructs[fieldKey].value = value;
    return true;
  }

  // Get a field key value from a specific record

  function getRecordFieldValue(uint256 pk, bytes32 fieldKey) public view returns (uint256) {
    require(isRecordFieldKey(pk, fieldKey), "GC: field not found");
    return recordStructs[pk].fieldStructs[fieldKey].value;
  }

  // Delete a complete record. Useful for reducing list size.

  function deleteRecord(uint256 pk) internal returns (bool) {
    require(isRecord(pk), "GC: record not found");
    uint256 rowToDelete = recordStructs[pk].recordListPointer;
    uint256 keyToMove = recordList[recordList.length - 1];
    recordStructs[keyToMove].recordListPointer = rowToDelete;
    recordList[rowToDelete] = keyToMove;
    recordList.pop();
    return true;
  }

  // Delete a field key/value from a record. Useful for reducing list size.

  function deleteRecordField(uint256 pk, bytes32 fieldKey) internal returns (bool) {
    require(isRecordFieldKey(pk, fieldKey), "GC: field not found");
    uint256 rowToDelete = recordStructs[pk].fieldStructs[fieldKey].fieldKeyListPointer;
    uint256 recordFieldCount = recordStructs[pk].fieldKeyList.length;
    bytes32 keyToMove = recordStructs[pk].fieldKeyList[recordFieldCount - 1];
    recordStructs[pk].fieldStructs[keyToMove].fieldKeyListPointer = rowToDelete;
    recordStructs[pk].fieldKeyList[rowToDelete] = keyToMove;
    recordStructs[pk].fieldKeyList.pop();
    return true;
  }
}
