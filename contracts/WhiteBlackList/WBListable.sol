// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

abstract contract WhiteBlackListable is Initializable, AccessControlUpgradeable {

    mapping (address => bool) whiteListed;
    mapping (address => bool) blackListed;

    event Blacklisted(address indexed addr);
    event UnBlacklisted(address indexed addr);
    event Whitelisted(address indexed addr);
    event UnWhitelisted(address indexed addr);


    function __WhiteBlackListable_init() initializer public {
        __AccessControl_init_unchained();
        __WhiteBlackListable_init_unchained();
    }

    function __WhiteBlackListable_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function blacklist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        blackListed[addr] = true;
        emit Blacklisted(addr);
    }

    function unblacklist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        blacklisted[addr] = false;
        emit UnBlacklisted(addr);
    }

    function isBlacklisted(address addr) public view returns (bool) {
        return blackListed[addr];
    }

    function whitelist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        whiteListed[addr] = true;
        emit Whitelisted(addr);
    }

    function unwhitelist(address addr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Error: must have admin role");
        whitelisted[addr] = false;
        emit UnWhitelisted(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whitelisted[addr];
    }
}