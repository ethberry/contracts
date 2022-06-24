// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC20ACFM is AccessControl, ERC20FlashMint {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  uint256 _flashFeeAmount;
  address _flashFeeReceiverAddress;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function flashFee(address token, uint256 amount) public view virtual override returns (uint256) {
    super.flashFee(token, amount);
    return _flashFeeAmount;
  }

  function setFlashFee(uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _flashFeeAmount = amount;
  }

  function setFlashFeeReceiver(address receiver) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _flashFeeReceiverAddress = receiver;
  }

  function flashFeeReceiver() public view returns (address) {
    return _flashFeeReceiver();
  }

  function _flashFeeReceiver() internal view returns (address) {
    return _flashFeeReceiverAddress;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
    return
      interfaceId == type(IERC20).interfaceId ||
      interfaceId == type(IERC20Metadata).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
