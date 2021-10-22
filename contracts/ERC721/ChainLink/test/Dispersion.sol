// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Dispersion  {
    using SafeMath for uint256;

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