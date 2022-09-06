// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC998ERC721ACBERS.sol";
import "../WhiteListChild.sol";

contract ERC998ERC721ACBERSWL is ERC998ERC721ACBERS, WhiteListChild {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty
  ) ERC998ERC721ACBERS(name, symbol, royalty) {}

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

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC998ERC721ACBERS, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
