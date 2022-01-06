// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IERC721Gemunion {
  function cap() external view returns (uint256);

  function mint(address to) external;

  function getCurrentTokenIndex() external view returns (uint256);
}
