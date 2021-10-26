// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Erc20Store is AccessControl, Pausable {
    using SafeMath for uint256;
    using Address for address;
    using ERC165Checker for address;
    using SafeERC20 for IERC20;

    IERC20 private _acceptedToken;
    IERC721 private _lootBox;

    bytes4 public constant ERC721_Interface = bytes4(0x80ac58cd);

    /**
      * @dev Initialize this contract. Acts as a constructor
      * @param acceptedToken - Address of the ERC20 accepted for this marketplace
      */
    constructor(address acceptedToken, address lootBox) {
        require(acceptedToken.isContract(), "The accepted token address must be a deployed contract");
        _acceptedToken = IERC20(acceptedToken);

        require(lootBox.isContract(), "The LootBox Address should be a contract");
        require(
            lootBox.supportsInterface(ERC721_Interface),
            "The LootBox contract has an invalid ERC721 implementation"
        );
        _lootBox = IERC721(acceptedToken);
    }

    function mintLootBox(uint256 amount)
    public
    whenNotPaused
    {
        _acceptedToken.transferFrom(_msgSender(), address(this), amount);
        // _lootBox.mintTo(_msgSender());
    }

}