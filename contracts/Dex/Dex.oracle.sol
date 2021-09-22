// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

import "hardhat/console.sol";

import "../PriceOracle/IPriceOracle.sol";

contract DexWithOracle is PausableUpgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressUpgradeable for address;

    event Bought(uint256 amount);
    event Sold(uint256 amount);
    event Received(uint amount);

    IERC20Upgradeable public acceptedToken;
    IPriceOracle public priceOracle;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        address _acceptedToken,
        address _priceOracle
    ) initializer public {
        __Pausable_init();
        __Ownable_init();

        require(_acceptedToken.isContract(), "The accepted token address must be a deployed contract");
        acceptedToken = IERC20Upgradeable(_acceptedToken);

        require(_priceOracle.isContract(), "The Oracle must be a deployed contract");
        priceOracle = IPriceOracle(_priceOracle);
    }

    function buy() payable public {
        console.log("msg.value %s", msg.value);
        require(msg.value > 0, "You need to send some ether");
        uint256 amountToBuy = getTokenAmount(msg.value, priceOracle.priceInWei());
        console.log("amountToBuy %s", amountToBuy);
        require(amountToBuy > 0, "Not enough to buy even one token");
        uint256 dexBalance = acceptedToken.balanceOf(address(this));
        require(amountToBuy <= dexBalance, "Not enough tokens in the reserve");
        acceptedToken.transfer(msg.sender, amountToBuy);
        emit Bought(amountToBuy);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = acceptedToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        acceptedToken.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

    receive() external payable {
        emit Received(msg.value);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Owner has no balance to withdraw");
        payable(msg.sender).transfer(amount);
    }

    function getTokenAmount(uint256 weiAmount, uint256 priceInWei) internal pure returns (uint256) {
        uint256 tokens = weiAmount.div(priceInWei);
        return tokens;
    }
}
