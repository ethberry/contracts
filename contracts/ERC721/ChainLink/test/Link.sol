// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Link is VRFConsumerBase {
    using SafeMath for uint256;

    event Random(uint256 id);

    bytes32 internal keyHash;
    uint256 internal fee;
    address link_addr;
    address vrfCoordinator;

    constructor(address _vrfCoordinator, address _link) VRFConsumerBase(
        _vrfCoordinator,
        _link
    ) {
        keyHash = 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186;
        fee = 0.1 * 10 ** 18;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d6Result = randomness.mod(6).add(1);
        emit Random(d6Result);
    }

}