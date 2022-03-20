// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "../ERC998ERC721TopDown.sol";
import "../MaxChildType.sol";

contract ERC998ERC721TopDownMaxChildType is ERC998ERC721TopDown, MaxChildType {

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 cap
  ) ERC998ERC721TopDown(name, symbol, baseTokenURI, cap) {}

  function removeChild(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override onlyChildClassWithDecrement(_childContract, _childTokenId) {
    super.removeChild(_tokenId, _childContract, _childTokenId);
  }

  function receiveChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override onlyChildClassWithIncrement(_childContract, _childTokenId) {
    super.receiveChild(_from, _tokenId, _childContract, _childTokenId);
  }

  function setMaxChild(uint256 childType, uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setMaxChild(childType, max);
  }
}
