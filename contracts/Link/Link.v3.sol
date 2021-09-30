// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

import "../VRF/VRFConsumerBaseUpgradable.sol";

contract Link3 is Initializable, VRFConsumerBaseUpgradable {
    using SafeMathUpgradeable for uint256;

    address internal _link;
    address internal _vrfCoordinator;
    bytes32 internal _keyHash;
    uint256 internal _fee;

    function initialize(
//        address _vrfCoordinator,
//        address _link,
//        bytes32 _keyHash,
//        uint256 _fee
    )

    public
    initializer
    {
        // RINKEBY
        _fee = 0.1 ether;
        _vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
        _link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
        _keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        //        keyHash = _keyHash;
        //        fee = _fee;
        __VRFConsumerBaseUpgradable_init(_vrfCoordinator, _link);

    }

    function getRandomNumber(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= _fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(_keyHash, _fee, userProvidedSeed);
    }

    event Snapshot(uint256 id);
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d6Result = randomness.mod(6).add(1);
        emit Snapshot(d6Result);
    }
}