// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC20VestingFactory.sol";
import "./ERC20TokenFactory.sol";
import "./ERC721TokenFactory.sol";
import "./ERC1155TokenFactory.sol";

contract ContractManager is ERC20VestingFactory, ERC20TokenFactory, ERC721TokenFactory, ERC1155TokenFactory {

}
