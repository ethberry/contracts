// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface ERC677Receiver {
  function onTokenTransfer(address _sender, uint _value, bytes calldata _data) external;
}

pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract LinkErc20 is
        ERC20PresetMinterPauser,
        ERC20Capped,
        ERC20Snapshot {
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");

    constructor(string memory _name, string memory _symbol) ERC20PresetMinterPauser(_name, _symbol) ERC20Capped(2 * 1e9 * 1e18) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(SNAPSHOT_ROLE, _msgSender());
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        super._mint(account, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal
    whenNotPaused
    override(ERC20, ERC20Snapshot, ERC20PresetMinterPauser)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    // VRF CORDINATOR TEST

    function transferAndCall(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) external returns (bool success)
    {
      super.transfer(_to, _value);
//      Transfer(msg.sender, _to, _value, _data);
      if (isContract(_to)) {
        contractFallback(_to, _value, _data);
      }
      return true;
    }

    function contractFallback(address _to, uint _value, bytes  calldata _data)
    private
    {
      ERC677Receiver receiver = ERC677Receiver(_to);
      receiver.onTokenTransfer(msg.sender, _value, _data);
    }

    function isContract(address _addr)
    private
    returns (bool hasCode)
    {
      uint length;
      assembly { length := extcodesize(_addr) }
      return length > 0;
    }

}
