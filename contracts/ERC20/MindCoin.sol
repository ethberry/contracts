// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";

import "../AccessList/BlackList.sol";

contract MindCoin is Initializable, BlackListUpgradeable,
        ERC20PresetMinterPauserUpgradeable,
        ERC20CappedUpgradeable,
        ERC20SnapshotUpgradeable {
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");

    function initialize(string memory _name, string memory _symbol) public override virtual initializer {
        __MindCoin_init(_name, _symbol);
    }

    function __MindCoin_init(string memory _name, string memory _symbol) internal initializer {
        __ERC20PresetMinterPauser_init(_name, _symbol);

        __ERC20Capped_init_unchained(2 * 1e9 * 1e18);
        __ERC20Snapshot_init_unchained();

        __BlackList_init_unchained();

        __MindCoin_init_unchained();
    }

    function __MindCoin_init_unchained() internal initializer {
        _setupRole(SNAPSHOT_ROLE, _msgSender());
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20Upgradeable, ERC20CappedUpgradeable) {
        super._mint(account, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal
    whenNotPaused
    override(ERC20Upgradeable, ERC20SnapshotUpgradeable, ERC20PresetMinterPauserUpgradeable)
    {
        require(!isBlacklisted(from), "Error: sender is BlackListed");
        require(!isBlacklisted(to), "Error: receiver is BlackListed");
        super._beforeTokenTransfer(from, to, amount);
    }

    // VRF CORDINATOR TEST
    function transferAndCall(
        address to,
        uint256 value,
        bytes calldata data
    )
    external
    pure
    returns (
        bool success
    )
    {
        return true;
    }
}