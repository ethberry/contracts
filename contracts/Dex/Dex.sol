// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "../PriceOracle/IPriceOracle.sol";

contract Dex is Context, Pausable, PaymentSplitter {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    IERC20 public acceptedToken;
    IPriceOracle public priceOracle;

    constructor(
        address acceptedToken_,
        address priceOracle_,
        address[] memory payees_,
        uint256[] memory shares_
    ) PaymentSplitter(payees_, shares_) {
        require(acceptedToken_.isContract(), "The accepted token address must be a deployed contract");
        acceptedToken = IERC20(acceptedToken_);

        require(priceOracle_.isContract(), "The Oracle must be a deployed contract");
        priceOracle = IPriceOracle(priceOracle_);
    }

    function buy() payable whenNotPaused public {
        require(msg.value > 0, "You need to send some ether");
        uint256 amountOfToken = getTokenAmount(msg.value, priceOracle.priceInWei());
        require(amountOfToken > 0, "Not enough to buy even one token");
        uint256 dexBalance = acceptedToken.balanceOf(address(this));
        require(amountOfToken <= dexBalance, "Not enough tokens in the reserve");
        acceptedToken.safeTransfer(_msgSender(), amountOfToken);
        emit Bought(amountOfToken);
    }

    function sell(uint256 amountOfToken) whenNotPaused public {
        require(amountOfToken > 0, "You need to sell at least some tokens");
        uint256 allowance = acceptedToken.allowance(_msgSender(), address(this));
        require(allowance >= amountOfToken, "Check the token allowance");
        uint256 amountOfWei = getWeiAmount(amountOfToken, priceOracle.priceInWei());
        acceptedToken.safeTransferFrom(_msgSender(), address(this), amountOfToken);
        payable(_msgSender()).transfer(amountOfWei);
        emit Sold(amountOfToken);
    }

    function getTokenAmount(uint256 weiAmount, uint256 priceInWei) internal pure returns (uint256) {
        return weiAmount.div(priceInWei);
    }

    function getWeiAmount(uint256 tokenAmount, uint256 priceInWei) internal pure returns (uint256) {
        return tokenAmount.mul(priceInWei);
    }
}
