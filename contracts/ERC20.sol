// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// https://docs.openzeppelin.com/contracts/2.x/api/token/erc20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MindToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100 * 10 ** uint(decimals()));
    }
}