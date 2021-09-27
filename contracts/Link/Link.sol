// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

import "./VRFConsumerBaseUpgradable.sol";

contract Link is Initializable, VRFConsumerBaseUpgradable {
    using SafeMathUpgradeable for uint256;

    bytes32 internal keyHash;
    uint256 internal fee;

    function initialize(address _vrfCoordinator, address _link)
    public
    initializer
    {
        __VRFConsumerBaseUpgradable_init(_vrfCoordinator, _link);

        keyHash = 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186;
        fee = 0.1 * 10 ** 18;
    }

    function getRandomNumber(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d6Result = randomness.mod(6).add(1);
    }

}