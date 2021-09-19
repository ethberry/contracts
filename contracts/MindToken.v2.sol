// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// https://docs.openzeppelin.com/contracts/2.x/api/token/erc20
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract MindToken2 is ERC20Upgradeable {
    address public owner;

    function initialize(string memory name, string memory symbol) initializer public {
        __ERC20_init(name, symbol);
        _mint(msg.sender, 100 * 10 ** uint(decimals()));
        owner = msg.sender;
    }
}