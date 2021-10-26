// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GatewayErc1155 is ERC1155, AccessControl {

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  mapping(uint256 => uint256) private _tokenIds;

  constructor() ERC1155("http://localhost/") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to, uint256 tokenId, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, tokenId, amount, "");
  }

  function supportsInterface(bytes4 interfaceId)
  public
  view
  override(ERC1155, AccessControl)
  returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
