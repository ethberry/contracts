// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract WhiteListExtended is AccessControl {    
    struct WhiteListInfo {
        bool permission;
        uint256 maxCount;
        uint256 counter;
    }

    mapping(address => WhiteListInfo) whiteList;

    event Whitelisted(address indexed addr, uint256 maxCount);
    event UnWhitelisted(address indexed addr);

    function whitelist(address _addr, uint256 _maxCount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteList[_addr].permission = true;
        whiteList[_addr].maxCount = _maxCount;
        emit Whitelisted(_addr, _maxCount);
    }

    function unWhitelist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteList[addr].permission = false;
        emit UnWhitelisted(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whiteList[addr].permission;
    }

    function _whitelist(address account) internal view {
        require(isWhitelisted(account), "WhiteListExtended: the contract is not on the whitelist");
    }

    function getMaxCountWhiteList(address addr) public view returns (uint256) {
        _whitelist(addr);
        return whiteList[addr].maxCount;
    }

    function changeMaxCountWhiteList(address addr, uint256 _max) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _whitelist(addr);
        whiteList[addr].maxCount = _max;
    }

    function getCurrentCountWhiteList(address addr) public view returns (uint256) {
        _whitelist(addr);
        return whiteList[addr].counter;
    }

    function incrementCountWhiteList(address addr) public {
        _whitelist(addr);
        if(whiteList[addr].maxCount > 0){
            require(whiteList[addr].counter < whiteList[addr].maxCount, "WhiteListExtended: excess number of tokens");
        }
        whiteList[addr].counter++;
    }

    function decrementCountWhiteList(address addr) public {
        _whitelist(addr);
        if(whiteList[addr].counter > 0) {
            whiteList[addr].counter--;
        }
    }

    modifier onlyWhiteListed(address _addr) {
        _whitelist(_addr);
        _;
    }

    modifier onlyWhiteListedWhithIncrement(address _addr) {
        incrementCountWhiteList(_addr);
        _;
    }

    modifier onlyWhiteListedWhithDecrement(address _addr) {
        decrementCountWhiteList(_addr);
        _;
    }
}
