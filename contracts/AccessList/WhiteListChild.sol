// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract WhiteListChild is AccessControl {    
    uint256 private maxChildCount;
    mapping (address => bool) whiteListChildAccess;
    mapping (address => uint256) private childContractsCounter;

    event WhitelistedChild(address indexed addr);
    event UnWhitelistedChild(address indexed addr);
    event SetMaxChild(uint256 indexed _maxCount);

    function whiteListChild(address _addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteListChildAccess[_addr]=true;
        emit WhitelistedChild(_addr);
    }

    function unWhitelistChild(address _addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteListChildAccess[_addr]=false;
        emit UnWhitelistedChild(_addr);
    }

    function isWhitelisted(address _addr) public view returns (bool) {
        return whiteListChildAccess[_addr];
    }

    function _whitelistChild(address _account) internal view {
        require(isWhitelisted(_account), "WhiteListChild: the contract is not on the whitelist");
    }

    function getMaxChild() public view returns (uint256) {
        return maxChildCount;
    }

    function setMaxChild(uint256 _max) public onlyRole(DEFAULT_ADMIN_ROLE) {
        maxChildCount = _max;
        emit SetMaxChild(_max);
    }

    function getChildCount(address addr) public view returns (uint256) {
        _whitelistChild(addr);
        return childContractsCounter[addr];
    }

    function incrementCountWhiteList(address addr) public {
        _whitelistChild(addr);
        if(maxChildCount > 0){
            require(childContractsCounter[addr] < maxChildCount, "WhiteListChild: excess number of tokens");
        }
        childContractsCounter[addr]++;
    }

    function decrementCountWhiteList(address addr) public {
        _whitelistChild(addr);
        if(childContractsCounter[addr] > 0) {
            childContractsCounter[addr]--;
        }
    }

    modifier onlyWhiteListed(address _addr) {
        _whitelistChild(_addr);
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
