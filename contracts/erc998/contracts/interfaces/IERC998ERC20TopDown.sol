// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

interface IERC998ERC20TopDown {

    function tokenFallback(address _from, uint256 _value, bytes memory _data) external;
    function balanceOfERC20(uint256 _tokenId, address _erc20Contract) external view returns (uint256);
    function transferERC20(uint256 _tokenId, address _to, address _erc20Contract, uint256 _value) external;
    function transferERC223(uint256 _tokenId, address _to, address _erc223Contract, uint256 _value, bytes memory _data) external;
    function getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) external;
}
