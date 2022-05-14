// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../../utils/GeneralizedCollection.sol";
import "../interfaces/IERC721Random.sol";
import "../ChainLink/ERC721ChainLinkBinance.sol";
import "../preset/ERC721ACBER.sol";
import "../ERC721BaseUrl.sol";


contract ERC721Random is IERC721Random, ERC721ChainLinkBinance, ERC721ACBER, ERC721BaseUrl, GeneralizedCollection {
  using Counters for Counters.Counter;

  struct Request {
    address owner;
    uint256 templateId;
    uint256 dropboxId;
  }

  event MintRandom(address to, uint256 tokenId, uint256 templateId, uint256 rarity, uint256 dropboxId);

  mapping(bytes32 => Request) internal _queue;

  uint256 private _maxTemplateId = 0;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) ERC721ACBER(name, symbol, baseTokenURI, royaltyNumerator) {
    _tokenIdTracker.increment();
    // should start from 1
  }

  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Random: wrong type");
    require(templateId <= _maxTemplateId, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId, dropboxId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    upsertRecordField(tokenId, keccak256(bytes("templateId")), request.templateId);
    upsertRecordField(tokenId, keccak256(bytes("rarity")), rarity);

    emit MintRandom(request.owner, tokenId, request.templateId, rarity, request.dropboxId);

    delete _queue[requestId];
    safeMint(request.owner);
  }

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    require(templateId != 0, "ERC721Random: wrong type");
    require(templateId <= _maxTemplateId, "ERC721Random: wrong type");
    tokenId = _tokenIdTracker.current();

    upsertRecordField(tokenId, keccak256(bytes("templateId")), templateId);
    upsertRecordField(tokenId, keccak256(bytes("rarity")), 1);

    safeMint(to);
  }

  function _getDispersion(uint256 randomness) internal pure virtual returns (uint256) {
    uint256 percent = (randomness % 100) + 1;
    if (percent < 1) {
      return 5;
    } else if (percent < 1 + 3) {
      return 4;
    } else if (percent < 1 + 3 + 8) {
      return 3;
    } else if (percent < 1 + 3 + 8 + 20) {
      return 2;
    }

    // common
    return 1;
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
