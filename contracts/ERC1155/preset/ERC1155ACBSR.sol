// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC1155ACRoyalty.sol";
import "./ERC1155ACBS.sol";

contract ERC1155ACBSR is ERC1155ACBS, ERC1155ACRoyalty {
  constructor(string memory uri, uint96 royaltyNumerator) ERC1155ACBS(uri) {
    _setDefaultRoyalty(_msgSender(), royaltyNumerator);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC1155ACBS, ERC1155ACRoyalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
