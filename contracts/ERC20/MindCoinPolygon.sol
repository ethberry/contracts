// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./MindCoin.sol";

contract MindCoinPolygon is MindCoin {
    bytes32 public constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");

    constructor(string memory _name, string memory _symbol) MindCoin(_name, _symbol) {
        // Minting in constructor is not allowed
        // https://docs.polygon.technology/docs/develop/ethereum-polygon/pos/mapping-assets#implementation
    }

    /**
     * @notice called when token is deposited on root chain
     * @dev Should be callable only by ChildChainManager
     * Should handle deposit by minting the required amount for user
     * Make sure minting is done only by this function
     * @param user user address for whom deposit is being done
     * @param depositData abi encoded amount
     */
    function deposit(address user, bytes calldata depositData)
    external
    onlyRole(DEPOSITOR_ROLE)
    {
        uint256 amount = abi.decode(depositData, (uint256));
        _mint(user, amount);
    }

    /**
     * @notice called when user wants to withdraw tokens back to root chain
     * @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
     * @param amount amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external {
        _burn(_msgSender(), amount);
    }
}