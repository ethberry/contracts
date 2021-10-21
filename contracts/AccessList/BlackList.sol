// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

abstract contract BlackList is AccessControlEnumerable {

    mapping (address => bool) blackList;

    event Blacklisted(address indexed addr);
    event UnBlacklisted(address indexed addr);

    function blacklist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        blackList[addr] = true;
        emit Blacklisted(addr);
    }

    function unBlacklist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        blackList[addr] = false;
        emit UnBlacklisted(addr);
    }

    function isBlacklisted(address addr) public view returns (bool) {
        return blackList[addr];
    }

    function _blacklist(address account) internal view {
        if (isBlacklisted(account)) {
            revert(
            string(
                abi.encodePacked(
                    "BlackList: account ",
                    Strings.toHexString(uint160(account), 20),
                    " is blacklisted"
                )
            )
            );
        }
    }

    modifier onlyNotBlackListed() {
        _blacklist(_msgSender());
        _;
    }
}