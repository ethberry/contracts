// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/TokenTimelockUpgradeable.sol";

contract MindTokenTimelock is Initializable, TokenTimelockUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        IERC20Upgradeable token_,
        address beneficiary_,
        uint256 releaseTime_
    ) initializer public {
        __TokenTimelock_init(token_, beneficiary_, releaseTime_);
    }
}