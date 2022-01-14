// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./IERC721ChainLink.sol";

abstract contract ERC721ChainLink is VRFConsumerBase {
  using Strings for uint256;

  mapping(bytes32 /* requestId */ => address /* nft owner */) internal queue;

  bytes32 internal keyHash;
  uint256 internal fee;

  constructor(address _link, address _vrf, bytes32 _keyhash, uint256 _fee) VRFConsumerBase(_vrf, _link) {
    fee = _fee;
    keyHash = _keyhash;
  }

  function _useRandom(uint256 result, bytes32 requestId) internal virtual;
  function getRandomNumber() public virtual returns (bytes32 requestId);

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override (VRFConsumerBase) {
    _useRandom(randomness % 100 + 1, requestId);
  }

}
