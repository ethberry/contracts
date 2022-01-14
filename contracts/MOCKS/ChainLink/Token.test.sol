// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../../ERC721/ChainLink/ERC721ChainLink.sol";
import "../../ERC721/ERC721Gemunion.sol";

contract TokenTestLink is ERC721ChainLink, IERC721ChainLink, ERC721Gemunion {
  using Counters for Counters.Counter;

  mapping(uint256 /* tokenId */ => uint256 /* rarity */) private _rarity;
  mapping(bytes32 /* requestId */ => address /* nft owner */) internal _queue;

  constructor (
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    address _link,
    address _vrf,
    bytes32 _keyHash,
    uint256 _fee
  ) ERC721Gemunion(name, symbol, baseTokenURI, 1000) ERC721ChainLink(_link, _vrf, _keyHash, _fee) {

  }

  function mintRandom(address to) external onlyRole(MINTER_ROLE) override {
    _queue[getRandomNumber()] = to;
  }

  event MintRandom(address _owner, bytes32 _reqId);
  function _useRandom(uint256 result, bytes32 _requestId) internal override {
    _rarity[_tokenIdTracker.current()] = result;
    emit MintRandom(_queue[_requestId], _requestId);
    mint(_queue[_requestId]);
    delete _queue[_requestId];
  }

  event RandomRequest(bytes32 _requestId);
  function getRandomNumber() internal override returns (bytes32 requestId) {
    requestId = super.getRandomNumber();
    emit RandomRequest(requestId);
    return requestId;
  }

  function mint(address to) public onlyRole(MINTER_ROLE) override {
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  receive() external payable {
    revert();
  }
}
