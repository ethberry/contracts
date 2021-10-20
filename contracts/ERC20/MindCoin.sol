// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "../AccessList/BlackList.sol";

contract MindCoin is BlackList,
        ERC20PresetMinterPauser,
        ERC20Capped,
        ERC20Snapshot {
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");

    constructor(string memory _name, string memory _symbol) ERC20PresetMinterPauser(_name, _symbol) ERC20Capped(2 * 1e9 * 1e18) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(SNAPSHOT_ROLE, _msgSender());
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        super._mint(account, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal
    whenNotPaused
    override(ERC20, ERC20Snapshot, ERC20PresetMinterPauser)
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