// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Votes } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { IERC5805, IERC6372, IVotes } from "@openzeppelin/contracts/interfaces/IERC5805.sol";
import { EIP712, IERC5267 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

import { ERC20OB } from "./ERC20OB.sol";

contract ERC20OBV is ERC20OB, ERC20Votes {
  constructor(string memory name, string memory symbol) ERC20OB(name, symbol) EIP712(name, "1.0.0") {}

  function _update(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Votes) {
    super._update(from, to, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IVotes).interfaceId ||
      interfaceId == type(IERC5267).interfaceId ||
      interfaceId == type(IERC5805).interfaceId ||
      interfaceId == type(IERC6372).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  // this function exist because of ganache bug
  // See https://github.com/trufflesuite/ganache-core/issues/515
  function getChainId() external view returns (uint256) {
    return block.chainid;
  }
}
