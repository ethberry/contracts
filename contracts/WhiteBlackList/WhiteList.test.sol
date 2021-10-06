// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../WhiteBlackList/WhiteList.sol";

contract WhiteListTest is Initializable, WhiteListUpgradeable {

    function initialize() public virtual initializer {
        __WhiteListTest_init();
    }

    function __WhiteListTest_init() internal initializer {
        __WhiteList_init_unchained();
        __WhiteListTest_init_unchained();
    }

    function __WhiteListTest_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function testMe()
    external
    view
    onlyWhiteListed
    returns (
        bool success
    )
    {
        return true;
    }
}