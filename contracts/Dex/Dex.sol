// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";

import "../PriceOracle/IPriceOracle.sol";

contract Dex is Initializable, PausableUpgradeable, PaymentSplitterUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressUpgradeable for address;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    IERC20Upgradeable public acceptedToken;
    IPriceOracle public priceOracle;

    function initialize(
        address acceptedToken_,
        address priceOracle_,
        address[] memory payees_,
        uint256[] memory shares_
    ) initializer public {
        __Pausable_init();
        __PaymentSplitter_init(payees_, shares_);

        require(acceptedToken_.isContract(), "The accepted token address must be a deployed contract");
        acceptedToken = IERC20Upgradeable(acceptedToken_);

        require(priceOracle_.isContract(), "The Oracle must be a deployed contract");
        priceOracle = IPriceOracle(priceOracle_);
    }

    function buy() payable whenNotPaused public {
        require(msg.value > 0, "You need to send some ether");
        uint256 amountOfToken = getTokenAmount(msg.value, priceOracle.priceInWei());
        require(amountOfToken > 0, "Not enough to buy even one token");
        uint256 dexBalance = acceptedToken.balanceOf(address(this));
        require(amountOfToken <= dexBalance, "Not enough tokens in the reserve");
        acceptedToken.transfer(msg.sender, amountOfToken);
        emit Bought(amountOfToken);
    }

    function sell(uint256 amountOfToken) whenNotPaused public {
        require(amountOfToken > 0, "You need to sell at least some tokens");
        uint256 allowance = acceptedToken.allowance(msg.sender, address(this));
        require(allowance >= amountOfToken, "Check the token allowance");
        uint256 amountOfWei = getWeiAmount(amountOfToken, priceOracle.priceInWei());
        acceptedToken.transferFrom(msg.sender, address(this), amountOfToken);
        payable(msg.sender).transfer(amountOfWei);
        emit Sold(amountOfToken);
    }

    function getTokenAmount(uint256 weiAmount, uint256 priceInWei) internal pure returns (uint256) {
        return weiAmount.div(priceInWei);
    }

    function getWeiAmount(uint256 tokenAmount, uint256 priceInWei) internal pure returns (uint256) {
        return tokenAmount.mul(priceInWei);
    }
}
