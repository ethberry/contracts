// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IERC721Random {
  struct Data {
    uint256 templateId;
    uint256 rarity;
  }

  function getDataByTokenId(uint256 tokenId) external view returns (Data memory);

  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external;

  function mintCommon(address to, uint256 templateId) external returns (uint256);
}
