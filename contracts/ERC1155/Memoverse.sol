// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Memoverse is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    function initialize() initializer public {
        __ERC1155_init("http://localhost/");
        __AccessControl_init();
        __Pausable_init();
        __ERC1155Burnable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    // COLLECTION -> TYPE -> SIZE -> RARITY
    // [FOUNDERS, ...] -> [LAND, PALACE, ROOM, LOCI] -> [S, M, L, XL] -> [COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]

    // FOUNDERS_LAND_S
    // FOUNDERS_LAND_M
    // FOUNDERS_LAND_L
    // FOUNDERS_LAND_LX

    // FOUNDERS_PALACE_S x RARITY
    // FOUNDERS_PALACE_M x RARITY
    // FOUNDERS_PALACE_L x RARITY
    // FOUNDERS_PALACE_LX x RARITY

    // FOUNDERS_ROOM_S x RARITY
    // FOUNDERS_ROOM_M x RARITY
    // FOUNDERS_ROOM_L x RARITY
    // FOUNDERS_ROOM_LX x RARITY

    // FOUNDERS_LOCI
    // FOUNDERS_LOCI
    // FOUNDERS_LOCI
    // FOUNDERS_LOCI

    // TODO create collection
    // TODO set collection cap
    // TODO implement random


    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
    public
    onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    public
    onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal
    whenNotPaused
    override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155Upgradeable, AccessControlUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}