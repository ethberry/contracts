// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

abstract contract BlackListable is Initializable, AccessControlEnumerableUpgradeable {

    mapping (address => bool) blackList;

    event Blacklisted(address indexed addr);
    event UnBlacklisted(address indexed addr);

    function __BlackListable_init() initializer public {
        __AccessControlEnumerable_init_unchained();
        __BlackListable_init_unchained();
    }

    function __BlackListable_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function blacklist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        require(_msgSender() != addr, "Error: can not blacklist admin");
        blackList[addr] = true;
        emit Blacklisted(addr);
    }

    function unblacklist(address addr) public {
        require(super.hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        blackList[addr] = false;
        emit UnBlacklisted(addr);
    }

    function isBlacklisted(address addr) public view returns (bool) {
        return blackList[addr];
    }
}