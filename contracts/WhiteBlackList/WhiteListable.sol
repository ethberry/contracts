// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

abstract contract WhiteListable is Initializable, AccessControlEnumerableUpgradeable {

    mapping (address => bool) whiteList;

    event Whitelisted(address indexed addr);
    event UnWhitelisted(address indexed addr);


    function __WhiteListable_init() initializer public {
        __AccessControlEnumerable_init_unchained();
        __WhiteListable_init_unchained();
    }

    function __WhiteListable_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function whitelist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        whiteList[addr] = true;
        emit Whitelisted(addr);
    }

    function unwhitelist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        whiteList[addr] = false;
        emit UnWhitelisted(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whiteList[addr];
    }
}