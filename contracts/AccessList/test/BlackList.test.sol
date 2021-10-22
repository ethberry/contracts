// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "../BlackList.sol";

contract BlackListTest is BlackList {

    constructor() {
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