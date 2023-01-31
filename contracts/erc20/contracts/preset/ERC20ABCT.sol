// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "./ERC20ABC.sol";

contract ERC20ABCT is ERC20ABC, ERC20Permit {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20ABC(name, symbol, cap) ERC20Permit(name) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC20).interfaceId ||
      interfaceId == type(IERC20Metadata).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20ABC) {
    super._mint(account, amount);
  }

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
