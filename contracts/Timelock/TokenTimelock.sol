// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/TokenTimelockUpgradeable.sol";

contract TokenTimelock is Initializable, TokenTimelockUpgradeable {
    function initialize(
        IERC20Upgradeable _token,
        address _beneficiary,
        uint256 _releaseTime
    ) initializer public {
        __TokenTimelock_init(_token, _beneficiary, _releaseTime);
    }
}