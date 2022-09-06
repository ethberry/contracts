// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./interfaces/IStateHash.sol";

abstract contract StateHash is IStateHash {
  // tokenId => last state hash indicator
  mapping(uint256 => bytes32) internal tokenIdToStateHash;

  function stateHash(uint256 tokenId) external view returns (bytes32) {
    bytes32 _stateHash = tokenIdToStateHash[tokenId];
    require(_stateHash != 0, "CTD: stateHash of tokenId is zero");
    return _stateHash;
  }

  function _localRootId(uint256 tokenId) internal view virtual returns (uint256);

  function _calculateHash(
    bytes32 rootStateHash,
    uint256 rootTokenId,
    address childContract,
    uint256 childTokenId,
    uint256 balance,
    bytes32 childStateHash
  ) internal view virtual returns (bytes32) {
    return
      keccak256(abi.encodePacked(rootStateHash, rootTokenId, childContract, childTokenId, balance, childStateHash));
  }

  function _afterTokenTransfer(
    address from,
    address,
    uint256 tokenId
  ) internal virtual {
    if (from == address(0)) {
      tokenIdToStateHash[tokenId] = _calculateHash(0x00, tokenId, address(0), 0, 0, 0x00);
    }
  }

  function balanceOfERC20(uint256 _tokenId, address _erc20Contract) external view virtual returns (uint256);

  function _afterReceivedERC20(
    address,
    uint256 tokenId,
    address erc20Contract,
    uint256
  ) internal virtual {
    uint256 balance = this.balanceOfERC20(tokenId, erc20Contract);
    uint256 rootId = _localRootId(tokenId);
    tokenIdToStateHash[rootId] = _calculateHash(tokenIdToStateHash[rootId], tokenId, erc20Contract, 1, balance, 0x00);
  }

  function _afterRemoveERC20(
    uint256 _tokenId,
    address,
    address _erc20Contract,
    uint256
  ) internal virtual {
    uint256 balance = this.balanceOfERC20(_tokenId, _erc20Contract);
    uint256 rootId = _localRootId(_tokenId);
    tokenIdToStateHash[rootId] = _calculateHash(tokenIdToStateHash[rootId], _tokenId, _erc20Contract, 1, balance, 0x00);
  }

  function _afterReceiveERC721(
    address,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    if (_childContract == address(this)) {
      tokenIdToStateHash[rootId] = _calculateHash(
        tokenIdToStateHash[rootId],
        _tokenId,
        _childContract,
        _childTokenId,
        1,
        tokenIdToStateHash[_childTokenId]
      );
    } else {
      tokenIdToStateHash[rootId] = _calculateHash(
        tokenIdToStateHash[rootId],
        _tokenId,
        _childContract,
        _childTokenId,
        1,
        0x00
      );
    }
  }

  function _afterRemoveERC721(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    if (_childContract == address(this)) {
      bytes32 rootStateHash = tokenIdToStateHash[rootId];
      bytes32 childStateHash = tokenIdToStateHash[_childTokenId];
      tokenIdToStateHash[rootId] = _calculateHash(
        rootStateHash,
        _tokenId,
        _childContract,
        _childTokenId,
        0,
        childStateHash
      );
      tokenIdToStateHash[_childTokenId] = _calculateHash(
        rootStateHash,
        _childTokenId,
        _childContract,
        0,
        0,
        childStateHash
      );
    } else {
      tokenIdToStateHash[rootId] = _calculateHash(
        tokenIdToStateHash[rootId],
        _tokenId,
        _childContract,
        _childTokenId,
        0,
        0x00
      );
    }
  }

  function balanceOfERC1155(
    uint256 _tokenId,
    address _erc1155Contract,
    uint256 childTokenId
  ) external view virtual returns (uint256);

  function _afterReceiveERC1155(
    address,
    address,
    uint256 _tokenId,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory,
    bytes memory
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    bytes32 _newStateHash = tokenIdToStateHash[rootId];
    for (uint256 i = 0; i < _childTokenIds.length; ++i) {
      uint256 balance = this.balanceOfERC1155(_tokenId, _erc1155Contract, _childTokenIds[i]);
      _newStateHash = _calculateHash(_newStateHash, _tokenId, _erc1155Contract, _childTokenIds[i], balance, 0x00);
    }
    tokenIdToStateHash[rootId] = _newStateHash;
  }

  function _afterRemoveERC1155(
    address,
    uint256 _tokenId,
    address,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory,
    bytes memory
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    bytes32 _newStateHash = tokenIdToStateHash[rootId];
    for (uint256 i = 0; i < _childTokenIds.length; ++i) {
      uint256 balance = this.balanceOfERC1155(_tokenId, _erc1155Contract, _childTokenIds[i]);
      _newStateHash = _calculateHash(_newStateHash, _tokenId, _erc1155Contract, _childTokenIds[i], balance, 0x00);
    }
    tokenIdToStateHash[rootId] = _newStateHash;
  }
}
