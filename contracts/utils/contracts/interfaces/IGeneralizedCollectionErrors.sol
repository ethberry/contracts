// SPDX-License-Identifier: UNLICENSED


pragma solidity ^0.8.20;

interface IGeneralizedCollectionErrors {
  error RecordNotFound(uint256 pk);

  error RecordAlreadyExist(uint256 pk);

  error FieldNotFound(uint256 pk, bytes32 fieldKey);

  error FieldAlreadySet(uint256 pk, bytes32 fieldKey);
}
