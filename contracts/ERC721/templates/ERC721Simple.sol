// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IERC721Simple.sol";
import "../preset/ERC721ACBER.sol";
import "../ERC721BaseUrl.sol";

contract ERC721Simple is IERC721Simple, ERC721ACBER, ERC721BaseUrl {
  using Counters for Counters.Counter;

  struct Request {
    address owner;
    uint256 templateId;
    uint256 dropboxId;
  }

  mapping(uint256 => Data) internal _data;

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

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    require(templateId != 0, "ERC721Simple: wrong type");
    require(templateId <= _maxTemplateId, "ERC721Simple: wrong type");
    tokenId = _tokenIdTracker.current();
    _data[tokenId] = Data(templateId);
    safeMint(to);
  }

  function getDataByTokenId(uint256 tokenId) public view override returns (Data memory) {
    require(_exists(tokenId), "ERC721Simple: token does not exist");
    return _data[tokenId];
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
