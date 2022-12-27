// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-misc/contracts/GeneralizedCollection.sol";

pragma solidity ^0.8.9;

abstract contract ERC721MetaDataGetter is AccessControl, GeneralizedCollection {
  bytes32 public constant TEMPLATE_ID = keccak256("TEMPLATE_ID");
  bytes32 public constant GRADE = keccak256("GRADE");
  bytes32 public constant RARITY = keccak256("RARITY");
  bytes32 public constant GENES = keccak256("GENES");

  bytes32 public constant METADATA_ADMIN_ROLE = keccak256("METADATA_ADMIN_ROLE");

  constructor() {
    _setupRole(METADATA_ADMIN_ROLE, _msgSender());
  }

  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  function getTokenMetadata(uint256 tokenId) public view virtual returns (Metadata[] memory) {
    uint256 arrSize = recordStructs[tokenId].fieldKeyList.length;
    Metadata[] memory tokenMetadata = new Metadata[](arrSize);
    for (uint8 i = 0; i < arrSize; i++) {
      bytes32 metaField = recordStructs[tokenId].fieldKeyList[i];
      tokenMetadata[i] = Metadata(metaField, recordStructs[tokenId].fieldStructs[metaField].value);
    }
    return tokenMetadata;
  }

  function setTokenMetadata(uint256 tokenId, Metadata[] memory metadata) public onlyRole(METADATA_ADMIN_ROLE) {
    uint256 arrSize = metadata.length;
    for (uint8 i = 0; i < arrSize; i++) {
      upsertRecordField(tokenId, metadata[i].key, metadata[i].value);
    }
  }
}
