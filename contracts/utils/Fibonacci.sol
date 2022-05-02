// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

contract Fibonacci {
  // https://medium.com/coinmonks/fibonacci-in-solidity-8477d907e22a
  function fibonacci(uint256 n) external pure returns (uint256 a) {
    if (n == 0) {
      return 0;
    }
    uint256 h = n / 2;
    uint256 mask = 1;
    while (mask <= h) {
      mask <<= 1;
    }
    mask >>= 1;
    a = 1;
    uint256 b = 1;
    uint256 c;
    while (mask > 0) {
      c = a * a + b * b;
      if (n & mask > 0) {
        b = b * (b + 2 * a);
        a = c;
      } else {
        a = a * (2 * b - a);
        b = c;
      }
      mask >>= 1;
    }
  }
}
