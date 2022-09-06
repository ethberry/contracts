// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./interfaces/IERC998ERC721TopDownEnumerable.sol";
import "./ERC998ERC721.sol";

abstract contract ERC998ERC721Enumerable is ERC998ERC721, IERC998ERC721TopDownEnumerable {
  using EnumerableSet for EnumerableSet.UintSet;
  using EnumerableSet for EnumerableSet.AddressSet;

  function totalChildContracts(uint256 _tokenId) external view override returns (uint256) {
    return childContracts[_tokenId].length();
  }

  function childContractByIndex(uint256 _tokenId, uint256 _index)
    external
    view
    override
    returns (address childContract)
  {
    return childContracts[_tokenId].at(_index);
  }

  function totalChildTokens(uint256 _tokenId, address _childContract) external view override returns (uint256) {
    return childTokens[_tokenId][_childContract].length();
  }

  function childTokenByIndex(
    uint256 _tokenId,
    address _childContract,
    uint256 _index
  ) external view override returns (uint256 childTokenId) {
    return childTokens[_tokenId][_childContract].at(_index);
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
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC998ERC721TopDownEnumerable).interfaceId || super.supportsInterface(interfaceId);
  }
}
