// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../../ERC721/ChainLink/ERC721ChainLink.sol";
import "../../ERC721/preset/ERC721ACBEC.sol";

contract TokenTestLink is ERC721ChainLink, IERC721ChainLink, ERC721ACBEC {
  using Counters for Counters.Counter;

  mapping(uint256 /* tokenId */ => uint256 /* rarity */) private _rarity;
  mapping(bytes32 /* requestId */ => address /* nft owner */) internal _queue;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    address _link,
    address _vrf,
    bytes32 _keyHash,
    uint256 _fee
  ) ERC721ACBEC(name, symbol, baseTokenURI, 1000) ERC721ChainLink(_link, _vrf, _keyHash, _fee) {}

  function mintRandom(address to) external override onlyRole(MINTER_ROLE) {
    _queue[getRandomNumber()] = to;
  }

  event MintRandom(address owner, bytes32 requestId);

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    _rarity[_tokenIdTracker.current()] = (randomness % 100) + 1;
    emit MintRandom(_queue[requestId], requestId);
    mint(_queue[requestId]);
    delete _queue[requestId];
  }

  event RandomRequest(bytes32 requestId);

  function getRandomNumber() internal override returns (bytes32 requestId) {
    requestId = super.getRandomNumber();
    emit RandomRequest(requestId);
    return requestId;
  }

  function mint(address to) public override onlyRole(MINTER_ROLE) {
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  receive() external payable {
    revert();
  }
}
