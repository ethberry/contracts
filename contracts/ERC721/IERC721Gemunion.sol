// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IERC721Gemunion {
  function cap() external view returns (uint256);

  function safeMint(address to) external;

  function getCurrentTokenIndex() external view returns (uint256);
}
