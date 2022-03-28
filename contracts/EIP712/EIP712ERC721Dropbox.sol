// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../interfaces/IERC721Mintable.sol";

contract EIP712ERC721Dropbox is EIP712, Pausable, AccessControl {
  using Address for address;

  IERC721Mintable _factory;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 private immutable PERMIT_SIGNATURE = keccak256("NFT(address account,uint256 tokenId)");

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function setFactory(address factory) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(factory.isContract(), "EIP712ERC721Dropbox: the factory must be a deployed contract");
    _factory = IERC721Mintable(factory);
  }

  function redeem(
    address account,
    uint256 tokenId,
    address signer,
    bytes calldata signature
  ) external {
    // require(signature.length == 65, "EIP712ERC721Dropbox: Invalid signature");
    require(_verify(signer, _hash(account, tokenId), signature), "EIP712ERC721Dropbox: Invalid signature");
    _factory.mint(account, tokenId);
  }

  function _hash(address account, uint256 tokenId) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(PERMIT_SIGNATURE, account, tokenId)));
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
