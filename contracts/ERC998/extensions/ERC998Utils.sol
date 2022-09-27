// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC998Utils  {
  function _parseTokenId(bytes memory _data) internal pure returns (uint256 tokenId) {
    // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
    assembly {
      tokenId := mload(add(_data, 0x20))
    }
    if (_data.length < 32) {
      tokenId = tokenId >> (256 - _data.length * 8);
    }
  }

  function _asSingletonArray(uint256 element) internal pure returns (uint256[] memory) {
    uint256[] memory array = new uint256[](1);
    array[0] = element;

    return array;
  }

  function _ownerOrApproved(address _sender, uint256 _tokenId) internal virtual view;
}
