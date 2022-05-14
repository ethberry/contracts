// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IERC721Random {
  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external;

  function mintCommon(address to, uint256 templateId) external returns (uint256);
}
