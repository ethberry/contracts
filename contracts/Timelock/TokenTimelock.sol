// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/TokenTimelock.sol";

contract Vault is TokenTimelock {
    constructor(
        IERC20 _token,
        address _beneficiary,
        uint256 _releaseTime
    ) TokenTimelock(_token, _beneficiary, _releaseTime) {

    }
}