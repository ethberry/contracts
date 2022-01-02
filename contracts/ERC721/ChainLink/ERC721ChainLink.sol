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

  constructor(address _link, address _vrf, bytes32 _keyhash, uint256 _fee) VRFConsumerBase(_vrf, _link)
  {
    fee = _fee;
    keyHash = _keyhash;
  }

  function _mintRandom(uint256 result, address to) internal {
    _useRandom(result, to);
  }

  function _useRandom(uint256 result, address to) internal virtual;

  function getRandomNumber() public virtual returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) >= fee, "ERC721Link: Not enough LINK");
    return VRFConsumerBase.requestRandomness(keyHash, fee);
    }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override (VRFConsumerBase) {
    _mintRandom(randomness.mod(100), queue[requestId]);
    delete queue[requestId];
  }

}
