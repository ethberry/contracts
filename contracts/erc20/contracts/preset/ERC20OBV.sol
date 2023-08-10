// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

import "./ERC20OB.sol";

contract ERC20OBV is ERC20OB, ERC20Votes {
  constructor(string memory name, string memory symbol)
  ERC20OB(name, symbol)
  ERC20Permit(name){}

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._mint(to, amount);
  }

  function _burn(address account, uint256 amount)
  internal
  override(ERC20, ERC20Votes)
  {
    super._burn(account, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IVotes).interfaceId ||
      interfaceId == type(IERC5267).interfaceId ||
      interfaceId == type(IERC6372).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
