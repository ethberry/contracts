// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/TokenTimelockUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "hardhat/console.sol";

contract MindTokenTimelock is TokenTimelockUpgradeable, OwnableUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        IERC20Upgradeable token_,
        address beneficiary_,
        uint256 releaseTime_
    ) initializer public {
        __Ownable_init();
        __TokenTimelock_init(token_, beneficiary_, releaseTime_);
    }
}