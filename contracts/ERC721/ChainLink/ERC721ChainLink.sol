// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./IERC721ChainLink.sol";

abstract contract ERC721ChainLink is VRFConsumerBase {
  using SafeMath for uint256;
  using Strings for uint256;

  mapping(bytes32 /* requestId */ => address /* nft owner */) internal queue;

  bytes32 internal keyHash;
  uint256 internal fee;

  constructor(address _link, address _vrf, bytes _keyhash, uint256 _fee) VRFConsumerBase(_vrf, _link)
  {
    // BINANCE TESTNET
    fee = 0.1 ether;
    keyHash = 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186; // BINANCE
  // keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311; // rinkeby
  }

  function _mintRandom(uint256 result, address to) internal {
    _useRandom(result, to);
  }

  function _useRandom(uint256 result, address to) internal virtual;

  function getRandomNumber() public virtual returns (bytes32 requestId);

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override (VRFConsumerBase) {
    _mintRandom(randomness.mod(100), queue[requestId]);
    delete queue[requestId];
  }

}
