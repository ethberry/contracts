// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../../utils/GeneralizedCollection.sol";
import "../interfaces/IERC721Simple.sol";
import "../preset/ERC721ACBER.sol";
import "../ERC721BaseUrl.sol";

contract ERC721Simple is IERC721Simple, ERC721ACBER, ERC721BaseUrl, GeneralizedCollection {
  using Counters for Counters.Counter;

  struct Request {
    address owner;
    uint256 templateId;
    uint256 dropboxId;
  }

  uint256 private _maxTemplateId = 0;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) ERC721ACBER(name, symbol, baseTokenURI, royaltyNumerator) {
    // _tokenIdTracker.increment();
    // should start from 1
  }

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    require(templateId != 0, "ERC721Simple: wrong type");
    require(templateId <= _maxTemplateId, "ERC721Simple: wrong type");
    tokenId = _tokenIdTracker.current();
    upsertRecordField(tokenId, keccak256(bytes("templateId")), templateId);
    safeMint(to);
  }

  function setMaxTemplateId(uint256 maxTemplateId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxTemplateId = maxTemplateId;
  }

  function _baseURI() internal view virtual override(ERC721ACBER) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
