// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

contract DEX is PausableUpgradeable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressUpgradeable for address;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    IERC20Upgradeable public acceptedToken;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        address _acceptedToken
    ) initializer public {
        __Pausable_init();
        __Ownable_init();

        require(_acceptedToken.isContract(), "The accepted token address must be a deployed contract");
        acceptedToken = IERC20Upgradeable(_acceptedToken);
    }

    function buy() payable public {
        uint256 amountToBuy = msg.value;
        uint256 dexBalance = acceptedToken.balanceOf(address(this));
        require(amountToBuy > 0, "You need to send some ether");
        require(amountToBuy <= dexBalance, "Not enough tokens in the reserve");
        acceptedToken.transfer(msg.sender, amountToBuy);
        emit Bought(amountToBuy);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = acceptedToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        acceptedToken.transferFrom(msg.sender, address(this), amount);
        acceptedToken.safeTransfer(msg.sender, amount);
        emit Sold(amount);
    }

}
