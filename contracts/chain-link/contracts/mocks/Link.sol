// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ERC677Receiver {
  function onTokenTransfer(address _sender, uint256 _value, bytes calldata _data) external;
}

contract LINK is ERC20 {
  using Address for address;

  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

  function mint(address to, uint256 amount) public virtual {
    _mint(to, amount);
  }

  // VRF CORDINATOR TEST

  function transferAndCall(address _to, uint256 _value, bytes calldata _data) external returns (bool success) {
    super.transfer(_to, _value);
    // Transfer(msg.sender, _to, _value, _data);
    if (_to.isContract()) {
      contractFallback(_to, _value, _data);
    }
    return true;
  }

  function contractFallback(address _to, uint256 _value, bytes calldata _data) private {
    ERC677Receiver receiver = ERC677Receiver(_to);
    receiver.onTokenTransfer(msg.sender, _value, _data);
  }
}
