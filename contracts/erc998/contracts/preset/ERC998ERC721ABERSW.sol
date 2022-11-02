// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC998ERC721ABERS.sol";
import "../extensions/WhiteListChild.sol";

contract ERC998ERC721ABERSW is ERC998ERC721ABERS, WhiteListChild {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty
  ) ERC998ERC721ABERS(name, symbol, royalty) {}

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
    override(ERC998ERC721ABERS, AccessControl)
    returns (bool)
  {
    return interfaceId == type(IWhiteListChild).interfaceId || super.supportsInterface(interfaceId);
  }
}
