// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./IERC721ChainLink.sol";

abstract contract ERC721ChainLink is VRFConsumerBase {
  // mapping(bytes32 /* requestId */ => address /* nft owner */) internal _queue;

  bytes32 internal _keyHash;
  uint256 internal _fee;

  constructor(
    address vrf,
    address link,
    bytes32 keyHash,
    uint256 fee
  ) VRFConsumerBase(vrf, link) {
    _fee = fee;
    _keyHash = keyHash;
  }

  function _useRandom(uint256 result, bytes32 requestId) internal virtual;

  function getRandomNumber() internal virtual returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) >= _fee, "ERC721ChainLink: Not enough LINK");
    requestId = VRFConsumerBase.requestRandomness(_keyHash, _fee);
    return requestId;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override(VRFConsumerBase) {
    _useRandom((randomness % 100) + 1, requestId);
  }
}
