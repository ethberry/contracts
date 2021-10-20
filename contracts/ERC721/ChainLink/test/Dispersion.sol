// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

import "../utils/VRFConsumerBaseUpgradable.sol";

contract Dispersion is Initializable  {
    using SafeMathUpgradeable for uint256;

    function initialize() public initializer {

    }

    function getDispersion(uint256 randomness) external pure returns (uint256) {
        uint256 d100Result = randomness.mod(100);
        if (d100Result < 1) {
            return 1;
        } else if (d100Result < 1 + 3) {
            return 2;
        } else if (d100Result < 1 + 3 + 8) {
            return 3;
        } else if (d100Result < 1 + 3 + 8 + 20) {
            return 4;
        } // 68
        return 5;
    }

}