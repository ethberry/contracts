// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./IERC721ChainLink.sol";

abstract contract ERC721ChainLinkBinance is VRFConsumerBase {
  using SafeMath for uint256;
  using Strings for uint256;

  mapping(bytes32 /* requestId */ => address /* nft owner */) internal queue;

  bytes32 internal keyHash;
  uint256 internal fee;

  constructor() VRFConsumerBase(
    address(0xa555fC018435bef5A13C6c6870a9d4C11DEC329C), // vrfCoordinator
    address(0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06)  // LINK token
  )
  {
    fee = 0.1 ether;
    keyHash = 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186; // BINANCE
  }

  function _useRandom(uint256 result, bytes32 requestId) internal virtual;

  function getRandomNumber() public virtual returns (bytes32 requestId);

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override (VRFConsumerBase) {
    _useRandom(randomness.mod(100), requestId);
  }

}
