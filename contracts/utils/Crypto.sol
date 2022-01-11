// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;


import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract Crypto is EIP712 {
  using Counters for Counters.Counter;

  mapping(address => Counters.Counter) private _nonces;

  // solhint-disable-next-line var-name-mixedcase
  bytes32 private immutable _MYFUNC_TYPEHASH =
  keccak256("MyFunc(address owneraddr,address spenderaddr,uint256 value,uint256 nonce)");

  /**
   * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
   *
   * It's a good idea to use the same `name` that is defined as the ERC20 token name.
   */
  constructor(string memory name) EIP712(name, "1") {}

  event Myevent(uint256 value);
  function _myfunc(address owneraddr, address spenderaddr, uint256 value) public virtual {
    emit Myevent(value);
  }

  function execMyfunc(
    address owneraddr,
    address spenderaddr,
    uint256 value,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public virtual {

    uint256 nonc = _useNonce(owneraddr);
    bytes32 structHash = keccak256(abi.encode(_MYFUNC_TYPEHASH, owneraddr, spenderaddr, value, nonc));

    bytes32 hash = _hashTypedDataV4(structHash);

    address signer = ECDSA.recover(hash, v, r, s);
    require(signer == owneraddr, "ERC20Permit: invalid signature");

    _myfunc(owneraddr, spenderaddr, value);
  }

  struct MyRequest {
    address to;
    uint256 tokenId;
    uint256 nonce;
  }

  function execute(MyRequest calldata req) public payable {
    uint256 nonc = _useNonce(req.to);

    require(req.nonce == nonc, "Executor: current nonce does not match request");

        uint256 cost = 20600000;
        require(gasleft() >= cost, "not enough gas for consumer");

    require(msg.value >= cost, "Executor: not enough ETH in request");

    (bool success, bytes memory data) = address(this).call(
      abi.encodeWithSignature("_execfunc(uint256)", req.tokenId)
    );
    if (!success) {
      // solhint-disable-next-line no-inline-assembly
      assembly {
        returndatacopy(0, 0, returndatasize())
        revert(0, returndatasize())
      }
    }

  }

  event Execevent(uint256 tokenId, address sender);
  function _execfunc(uint256 tokenId) public payable /* must be public */ virtual {
    emit Execevent(tokenId, msg.sender);
  }

  function getsigner (bytes32 hashdata, uint8 v, bytes32 r, bytes32 s) public view returns (address signer){
    bytes32 hash = _hashTypedDataV4(hashdata);
    address signer = ECDSA.recover(hash, v, r, s);
    return signer;
  }

  /**
   * @dev See {IERC20Permit-nonces}.
   */
  function nonces(address owner) public view virtual returns (uint256) {
    return _nonces[owner].current();
  }

  /**
   * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
   */
  // solhint-disable-next-line func-name-mixedcase
  function DOMAIN_SEPARATOR() external view returns (bytes32) {
    return _domainSeparatorV4();
  }

  /**
   * @dev "Consume a nonce": return the current value and increment.
   *
   * _Available since v4.1._
   */
  function _useNonce(address owner) internal virtual returns (uint256 current) {
    Counters.Counter storage nonce = _nonces[owner];
    current = nonce.current();
    nonce.increment();
  }
}
