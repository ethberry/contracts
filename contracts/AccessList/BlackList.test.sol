// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./BlackList.sol";

contract BlackListTest is Initializable, BlackListUpgradeable {

    function initialize() public virtual initializer {
        __BlackListTest_init();
    }

    function __BlackListTest_init() internal initializer {
        __BlackList_init_unchained();
        __BlackListTest_init_unchained();
    }

    function __BlackListTest_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function testMe()
    external
    view
    onlyNotBlackListed
    returns (
        bool success
    )
    {
        return true;
    }
}