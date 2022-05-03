// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Dummy1 is Initializable {
  event Dummy(bool dummy);

  function initialize() public initializer {}

  function getDummy() public {
    emit Dummy(false);
  }
}

contract Dummy2 is Initializable {
  event Dummy(bool dummy);

  function initialize() public initializer {}

  function getDummy() public {
    emit Dummy(true);
  }
}
