// SPDX-License-Identifier: UNLICENSED

// Author: PavelZavadskiy
// Email: pavelzavadsky@gmail.com
// GitHub: https://github.com/PavelZavadskiy

pragma solidity ^0.8.4;

contract WhiteListChild {
  uint256 private _maxChildCount;
  mapping(address => bool) _whiteListChildAccess;
  mapping(address => uint256) private _childContractsCounter;

  event WhitelistedChild(address indexed addr);
  event UnWhitelistedChild(address indexed addr);
  event SetMaxChild(uint256 maxCount);

  function _whiteListChild(address addr) internal {
    _whiteListChildAccess[addr] = true;
    emit WhitelistedChild(addr);
  }

  function _unWhitelistChild(address addr) internal {
    _whiteListChildAccess[addr] = false;
    emit UnWhitelistedChild(addr);
  }

  function isWhitelisted(address addr) public view returns (bool) {
    return _whiteListChildAccess[addr];
  }

  function getMaxChild() public view returns (uint256) {
    return _maxChildCount;
  }

  function _setMaxChild(uint256 max) internal {
    _maxChildCount = max;
    emit SetMaxChild(max);
  }

  function getChildCount(address addr) public view onlyWhiteListed(addr) returns (uint256) {
    return _childContractsCounter[addr];
  }

  function incrementChildCount(address addr) public onlyWhiteListed(addr) {
    if (_maxChildCount > 0) {
      require(_childContractsCounter[addr] < _maxChildCount, "WhiteListChild: excess number of address");
    }
    _childContractsCounter[addr]++;
  }

  function decrementChildCount(address addr) public onlyWhiteListed(addr) {
    if (_childContractsCounter[addr] > 0) {
      _childContractsCounter[addr]--;
    }
  }

  modifier onlyWhiteListed(address addr) {
    require(isWhitelisted(addr), "WhiteListChild: the contract is not on the whitelist");
    _;
  }

  modifier onlyWhiteListedWithIncrement(address addr) {
    incrementChildCount(addr);
    _;
  }

  modifier onlyWhiteListedWithDecrement(address addr) {
    decrementChildCount(addr);
    _;
  }
}
