// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";


contract TokenTimelockErc20 is Initializable, ERC20Upgradeable, AccessControlUpgradeable  {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    function initialize() public virtual initializer {
        __StakingRewardsErc20_init();
    }

    function __StakingRewardsErc20_init() internal initializer {
        __Context_init_unchained();
        __ERC20_init_unchained("Test erc20 token", "TEST");
        __StakingRewardsErc20_unchained();
    }

    function __StakingRewardsErc20_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}