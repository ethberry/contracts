// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

abstract contract WhiteListUpgradeable is Initializable, AccessControlEnumerableUpgradeable {

    mapping(address => bool) whiteList;

    event Whitelisted(address indexed addr);
    event UnWhitelisted(address indexed addr);


    function __WhiteList_init() initializer public {
        __AccessControl_init_unchained();
        __WhiteList_init_unchained();
    }

    function __WhiteList_init_unchained() internal initializer {

    }

    function whitelist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteList[addr] = true;
        emit Whitelisted(addr);
    }

    function unWhitelist(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteList[addr] = false;
        emit UnWhitelisted(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whiteList[addr];
    }

    function _whitelist(address account) internal view {
        if (!isWhitelisted(account)) {
            revert(
                string(
                    abi.encodePacked(
                        "WhiteListUpgradeable: account ",
                        StringsUpgradeable.toHexString(uint160(account), 20),
                        " is not whitelisted"
                    )
                )
            );
        }
    }

    modifier onlyWhiteListed() {
        _whitelist(_msgSender());
        _;
    }
}