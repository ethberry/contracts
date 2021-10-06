// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

abstract contract BlackListUpgradeable is Initializable, AccessControlEnumerableUpgradeable {

    mapping (address => bool) blackList;

    event Blacklisted(address indexed addr);
    event UnBlacklisted(address indexed addr);

    function __BlackList_init() initializer public {
        __AccessControlEnumerable_init();
        __BlackList_init_unchained();
    }

    function __BlackList_init_unchained() internal initializer {

    }

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
        if (!isBlacklisted(account)) {
            revert(
            string(
                abi.encodePacked(
                    "BlackListUpgradeable: account ",
                    StringsUpgradeable.toHexString(uint160(account), 20),
                    " is not blacklisted"
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