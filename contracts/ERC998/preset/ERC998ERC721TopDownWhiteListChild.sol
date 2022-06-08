// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC998ERC721TopDown.sol";
import "../WhiteListChild.sol";

contract ERC998ERC721TopDownWhiteListChild is ERC998ERC721TopDown, WhiteListChild {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap
  ) ERC998ERC721TopDown(name, symbol, cap) {}

  function removeChild(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override onlyWhiteListedWithDecrement(_childContract) {
    super.removeChild(_tokenId, _childContract, _childTokenId);
  }

  function receiveChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override onlyWhiteListedWithIncrement(_childContract) {
    super.receiveChild(_from, _tokenId, _childContract, _childTokenId);
  }

  function whiteListChild(address addr) public onlyRole(DEFAULT_ADMIN_ROLE){
    _whiteListChild(addr);
  }

  function unWhitelistChild(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unWhitelistChild(addr);
  }

  function setDefaultMaxChild(uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setDefaultMaxChild(max);
  }

  function setMaxChild(address addr, uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setMaxChild(addr, max);
  }
}
