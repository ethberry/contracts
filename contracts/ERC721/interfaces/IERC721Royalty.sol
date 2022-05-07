// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IERC721Royalty {
  function setDefaultRoyalty(address royaltyReceiver, uint96 royaltyNumerator) external;
  function setTokenRoyalty(uint256 tokenId, address royaltyReceiver, uint96 royaltyNumerator) external;
}
