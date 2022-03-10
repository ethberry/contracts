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
    string memory baseTokenURI,
    uint256 cap
  ) ERC998ERC721TopDown(name, symbol, baseTokenURI, cap) {}

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

  function setMaxChild(uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setMaxChild(max);
  }

  ////////////////////////////////////////////////////////
  // ERC165 implementation
  ////////////////////////////////////////////////////////

  /**
   * @dev See {IERC165-supportsInterface}.
   * The interface id 0x1bc995e4 is added. The spec claims it to be the interface id of IERC998ERC721TopDown.
   * But it is not.
   * It is added anyway in case some contract checks it being compliant with the spec.
   */
  /* function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC998ERC721TopDown).interfaceId ||
      interfaceId == type(IERC998ERC721TopDownEnumerable).interfaceId ||
      interfaceId == 0x1bc995e4 ||
      super.supportsInterface(interfaceId);
  } */
}
