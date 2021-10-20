// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;


import "../WhiteList.sol";

contract WhiteListTest is WhiteList {

    constructor() {
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
