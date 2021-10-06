// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../WhiteBlackList/WhiteListable.sol";


contract Game is Initializable,
        ERC721HolderUpgradeable,
        PausableUpgradeable,
        OwnableUpgradeable,
        WhiteListable {
    function initialize() initializer public {
        __ERC721Holder_init_unchained();
        __Context_init_unchained();
        __Pausable_init_unchained();
        __Ownable_init_unchained();
        __WhiteListable_init_unchained();
    }
}