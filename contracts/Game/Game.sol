// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../WhiteBlackList/WhiteList.sol";


contract Game is Initializable, ERC721HolderUpgradeable,
PausableUpgradeable,
OwnableUpgradeable,
WhiteListUpgradeable {
    function initialize() initializer public {
        __ERC721Holder_init_unchained();
        __Context_init_unchained();
        __Pausable_init_unchained();
        __Ownable_init_unchained();
        __WhiteList_init_unchained();
    }
}