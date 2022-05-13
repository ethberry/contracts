// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IERC721Simple {
  struct Data {
    uint256 templateId;
  }

  function getDataByTokenId(uint256 tokenId) external view returns (Data memory);

  function mintCommon(address to, uint256 templateId) external returns (uint256);
}
