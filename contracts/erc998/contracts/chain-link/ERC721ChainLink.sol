// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./interfaces/IERC721ChainLink.sol";

abstract contract ERC721ChainLink is VRFConsumerBase {
  bytes32 internal _keyHash;
  uint256 internal _fee;

  constructor(address vrf, address link, bytes32 keyHash, uint256 fee) VRFConsumerBase(vrf, link) {
    _fee = fee;
    _keyHash = keyHash;
  }

  function getRandomNumber() internal virtual returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) >= _fee, "ERC721ChainLink: Not enough LINK");
    requestId = VRFConsumerBase.requestRandomness(_keyHash, _fee);
    return requestId;
  }
}
