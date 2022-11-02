// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./ERC998Utils.sol";
import "../interfaces/IERC998ERC1155TopDown.sol";
import "../interfaces/IERC998ERC1155TopDownEnumerable.sol";
import "../interfaces/IERC998TopDown.sol";

abstract contract ERC998ERC1155 is
  Context,
  ERC165,
  IERC721,
  IERC998TopDown,
  IERC998ERC1155TopDown,
  IERC1155Receiver,
  ERC998Utils
{
  // tokenId => (erc1155 contract => (childToken => balance))
  mapping(uint256 => mapping(address => mapping(uint256 => uint256))) internal erc1155Balances;

  /**
   * @dev See {IERC1155-safeTransferFrom}.
   */
  function safeTransferFromERC1155(
    uint256 _fromTokenId,
    address _to,
    address _erc1155Contract,
    uint256 _childTokenId,
    uint256 _amount,
    bytes memory _data
  ) public override {
    require(_to != address(0), "CTD: transferERC1155 _to zero address");
    address sender = _msgSender();
    _ownerOrApproved(sender, _fromTokenId);

    uint256[] memory childTokenIds = _asSingletonArray(_childTokenId);
    uint256[] memory amounts = _asSingletonArray(_amount);
    _beforeRemoveERC1155(sender, _fromTokenId, _to, _erc1155Contract, childTokenIds, amounts, _data);

    removeERC1155(_fromTokenId, _erc1155Contract, _childTokenId, _amount);
    emit TransferChild(_fromTokenId, _to, _erc1155Contract, _childTokenId, _amount);

    _afterRemoveERC1155(sender, _fromTokenId, _to, _erc1155Contract, childTokenIds, amounts, _data);

    IERC1155(_erc1155Contract).safeTransferFrom(address(this), _to, _childTokenId, _amount, _data);
  }

  /**
   * @dev See {IERC1155-safeBatchTransferFrom}.
   */
  function safeBatchTransferFromERC1155(
    uint256 _fromTokenId,
    address _to,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory _amounts,
    bytes memory _data
  ) public override {
    require(
      _childTokenIds.length == _amounts.length,
      "CTD: batchTransferERC1155 childTokenIds and amounts length mismatch"
    );
    require(_to != address(0), "CTD: batchTransferERC1155 _to zero address");
    address sender = _msgSender();
    _ownerOrApproved(sender, _fromTokenId);

    _beforeRemoveERC1155(sender, _fromTokenId, _to, _erc1155Contract, _childTokenIds, _amounts, _data);

    for (uint256 i = 0; i < _childTokenIds.length; ++i) {
      removeERC1155(_fromTokenId, _erc1155Contract, _childTokenIds[i], _amounts[i]);
    }
    emit BatchTransferChild(_fromTokenId, _to, _erc1155Contract, _childTokenIds, _amounts);

    _afterRemoveERC1155(sender, _fromTokenId, _to, _erc1155Contract, _childTokenIds, _amounts, _data);

    IERC1155(_erc1155Contract).safeBatchTransferFrom(address(this), _to, _childTokenIds, _amounts, _data);
  }

  function removeERC1155(uint256 _tokenId, address _erc1155Contract, uint256 _childTokenId, uint256 _amount)
    internal
    returns (uint256)
  {
    uint256 erc1155Balance = erc1155Balances[_tokenId][_erc1155Contract][_childTokenId];
    require(erc1155Balance >= _amount, "CTD: removeERC1155 value not enough");
    uint256 newERC1155Balance = erc1155Balance - _amount;
    erc1155Balances[_tokenId][_erc1155Contract][_childTokenId] = newERC1155Balance;
    return newERC1155Balance;
  }

  function _beforeRemoveERC1155(
    address _operator,
    uint256 _tokenId,
    address _to,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory _amounts,
    bytes memory data
  ) internal virtual {}

  function _afterRemoveERC1155(
    address _operator,
    uint256 _tokenId,
    address _to,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory _amounts,
    bytes memory data
  ) internal virtual {}

  /**
   * @dev See {IERC1155-balanceOf}.
   */
  function balanceOfERC1155(uint256 _tokenId, address _erc1155Contract, uint256 childTokenId)
    external
    view
    override
    returns (uint256)
  {
    return erc1155Balances[_tokenId][_erc1155Contract][childTokenId];
  }

  /**
   * @dev See {IERC1155-balanceOf}.
   */
  function balanceOfBatchERC1155(uint256[] memory _tokenIds, address _erc1155Contract, uint256[] memory childTokenIds)
    external
    view
    override
    returns (uint256[] memory)
  {
    require(
      _tokenIds.length == childTokenIds.length,
      "CTD: batchTransferERC1155 childTokenIds and tokenIds length mismatch"
    );

    uint256[] memory batchBalances = new uint256[](_tokenIds.length);

    for (uint256 i = 0; i < _tokenIds.length; ++i) {
      batchBalances[i] = erc1155Balances[_tokenIds[i]][_erc1155Contract][childTokenIds[i]];
    }

    return batchBalances;
  }

  /**
   * @dev See {IERC1155Receiver-onERC1155Received}.
   */
  function onERC1155Received(
    address _operator,
    address _from,
    uint256 _childTokenId,
    uint256 _amount,
    bytes calldata _data
  ) external override returns (bytes4) {
    require(
      _data.length > 0,
      "CTD: onERC1155Received _data must contain the uint256 tokenId to transfer the child token to"
    );
    // convert up to 32 bytes of _data to uint256, owner nft tokenId passed as uint in bytes
    uint256 tokenId = _parseTokenId(_data);
    require(ownerOf(tokenId) != address(0), "CTD: onERC1155Received tokenId does not exist.");

    address erc1155Contract = _msgSender();
    uint256[] memory childTokenIds = _asSingletonArray(_childTokenId);
    uint256[] memory amounts = _asSingletonArray(_amount);
    _beforeReceiveERC1155(_operator, _from, tokenId, erc1155Contract, childTokenIds, amounts, _data);

    uint256 erc1155Balance = erc1155Balances[tokenId][erc1155Contract][_childTokenId];
    erc1155Balances[tokenId][erc1155Contract][_childTokenId] = erc1155Balance + _amount;

    emit ReceivedChild(_from, tokenId, erc1155Contract, _childTokenId, _amount);

    _afterReceiveERC1155(_operator, _from, tokenId, erc1155Contract, childTokenIds, amounts, _data);

    return this.onERC1155Received.selector;
  }

  /**
   * @dev See {IERC1155Receiver-onERC1155Received}.
   */
  function onERC1155BatchReceived(
    address _operator,
    address _from,
    uint256[] calldata _childTokenIds,
    uint256[] calldata _amounts,
    bytes calldata _data
  ) external override returns (bytes4) {
    require(
      _data.length > 0,
      "CTD: onERC1155BatchReceived _data must contain the uint256 tokenId to transfer the child token to"
    );
    require(
      _childTokenIds.length == _amounts.length,
      "CTD: onERC1155BatchReceived _childTokenIds and _amounts lengths mismatch"
    );
    // convert up to 32 bytes of _data to uint256, owner nft tokenId passed as uint in bytes
    uint256 tokenId = _parseTokenId(_data);
    require(ownerOf(tokenId) != address(0), "CTD: onERC1155BatchReceived tokenId does not exist.");

    address erc1155Contract = _msgSender();
    _beforeReceiveERC1155(_operator, _from, tokenId, erc1155Contract, _childTokenIds, _amounts, _data);

    for (uint256 i = 0; i < _childTokenIds.length; ++i) {
      uint256 erc1155Balance = erc1155Balances[tokenId][erc1155Contract][_childTokenIds[i]];
      erc1155Balances[tokenId][erc1155Contract][_childTokenIds[i]] = erc1155Balance + _amounts[i];
    }

    emit BatchReceivedChild(_from, tokenId, erc1155Contract, _childTokenIds, _amounts);

    _afterReceiveERC1155(_operator, _from, tokenId, erc1155Contract, _childTokenIds, _amounts, _data);

    return this.onERC1155BatchReceived.selector;
  }

  function _beforeReceiveERC1155(
    address _operator,
    address _from,
    uint256 _tokenId,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory _amounts,
    bytes memory data
  ) internal virtual {}

  function _afterReceiveERC1155(
    address _operator,
    address _from,
    uint256 _tokenId,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory _amounts,
    bytes memory data
  ) internal virtual {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
    return
      interfaceId == type(IERC998ERC1155TopDown).interfaceId ||
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  ////////////////////////////////////////////////////////
  // ERC721 mock
  ////////////////////////////////////////////////////////

  function ownerOf(uint256 tokenId) public view virtual override returns (address);
}
