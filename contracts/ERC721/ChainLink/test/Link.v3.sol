// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Link3 is VRFConsumerBase {
    using SafeMath for uint256;

    address internal _link;
    address internal _vrfCoordinator;
    bytes32 internal _keyHash;
    uint256 internal _fee;

    constructor() VRFConsumerBase(
        address(0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B),
        address(0x01BE23585060835E02B77ef475b0Cc51aA1e0709)
    ){
        // RINKEBY
        _fee = 0.1 ether;
        _keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;

    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= _fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(_keyHash, _fee);
    }

    event Snapshot(uint256 id);

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d6Result = randomness.mod(6).add(1);
        emit Snapshot(d6Result);
    }
}