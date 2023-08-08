// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlCrossChain.sol";

import "@gemunion/contracts-misc/contracts/roles.sol";
import "@gemunion/contracts-erc1363/contracts/extensions/ERC1363.sol";

contract ERC20XB is AccessControlCrossChain, ERC20Burnable, ERC1363 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function _isCrossChain() internal view virtual override returns (bool) {
    return false;
  }

  function _crossChainSender() internal view virtual override returns (address) {
    revert NotCrossChainCall();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1363) returns (bool) {
    return
      interfaceId == type(IERC20).interfaceId ||
      interfaceId == type(IERC20Metadata).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
