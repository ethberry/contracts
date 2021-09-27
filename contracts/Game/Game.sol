// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract Game is Initializable, ERC721HolderUpgradeable, PausableUpgradeable, OwnableUpgradeable {
    function initialize() initializer public {
        __Pausable_init();
        __Ownable_init();
        __ERC721Holder_init();
    }
}