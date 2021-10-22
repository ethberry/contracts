// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Link2 is VRFConsumerBase {
    using SafeMath for uint256;

    bytes32 internal keyHash;
    uint256 internal fee;

    constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee)
    VRFConsumerBase(_vrfCoordinator, _link) {
        keyHash = _keyHash;
        fee = _fee;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d6Result = randomness.mod(6).add(1);
        emit Snapshot(d6Result);

    }

    event Snapshot(uint256 id);
}