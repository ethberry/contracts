// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC20AndERC223.sol";
import "./interfaces/IERC998ERC20TopDown.sol";
import "./interfaces/IERC998ERC20TopDownEnumerable.sol";
import "./interfaces/IERC998ERC721BottomUp.sol";
import "./interfaces/IERC998ERC721TopDown.sol";
import "./interfaces/IERC998ERC721TopDownEnumerable.sol";

import "../ERC721/ERC721Gemunion.sol";

abstract contract ComposableTopDown is
  ERC721Gemunion,
  IERC998ERC721TopDown,
  IERC998ERC721TopDownEnumerable,
  IERC998ERC20TopDown,
  IERC998ERC20TopDownEnumerable
{
  using Address for address;
  using EnumerableSet for EnumerableSet.UintSet;
  using EnumerableSet for EnumerableSet.AddressSet;
  using Counters for Counters.Counter;
  // return this.rootOwnerOf.selector ^ this.rootOwnerOfChild.selector ^
  //   this.tokenOwnerOf.selector ^ this.ownerOfChild.selector;
  bytes4 constant ERC998_MAGIC_VALUE = 0xcd740db5;
  bytes32 constant ERC998_MAGIC_VALUE_32 = 0xcd740db500000000000000000000000000000000000000000000000000000000;

  // tokenId => last state hash indicator
  mapping(uint256 => uint256) private tokenIdToStateHash;

  // root token owner address => (tokenId => approved address)
  mapping(address => mapping(uint256 => address)) private rootOwnerAndTokenIdToApprovedAddress;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 cap
  ) ERC721Gemunion(name, symbol, baseTokenURI, cap) {}

  function safeMint(address to) public virtual override onlyRole(MINTER_ROLE) {
    require(to != address(0), "ComposableTopDown: _to zero address");

    uint256 tokenCount = _tokenIdTracker.current();
    tokenIdToStateHash[tokenCount] = uint256(keccak256(abi.encodePacked(uint256(uint160(address(this))), tokenCount)));

    _safeMint(to, tokenCount);
    _tokenIdTracker.increment();
  }

  //  function safeTransferFrom(
  //    address _from,
  //    address _to,
  //    uint256 _tokenId,
  //    bytes memory _data
  //  ) public override {
  //    super.safeTransferFrom(_from, _to, _tokenId, _data);
  //    rootOwnerOf(_tokenId);
  //  }

  //from zepellin ERC721Receiver.sol
  //old version
  bytes4 constant ERC721_RECEIVED_OLD = 0xf0b9e5ba;
  //new version
  bytes4 constant ERC721_RECEIVED_NEW = 0x150b7a02;

  bytes4 constant ALLOWANCE = bytes4(keccak256("allowance(address,address)"));
  bytes4 constant APPROVE = bytes4(keccak256("approve(address,uint256)"));
  bytes4 constant ROOT_OWNER_OF_CHILD = bytes4(keccak256("rootOwnerOfChild(address,uint256)"));

  ////////////////////////////////////////////////////////
  // ERC721 implementation
  ////////////////////////////////////////////////////////
  function rootOwnerOf(uint256 _tokenId) public view override returns (bytes32 rootOwner) {
    return rootOwnerOfChild(address(0), _tokenId);
  }

  // returns the owner at the top of the tree of composables
  // Use Cases handled:
  // Case 1: Token owner is this contract and token.
  // Case 2: Token owner is other top-down composable
  // Case 3: Token owner is other contract
  // Case 4: Token owner is user
  function rootOwnerOfChild(address _childContract, uint256 _childTokenId)
    public
    view
    override
    returns (bytes32 rootOwner)
  {
    address rootOwnerAddress;
    if (_childContract != address(0)) {
      (rootOwnerAddress, _childTokenId) = _ownerOfChild(_childContract, _childTokenId);
    } else {
      rootOwnerAddress = ownerOf(_childTokenId);
      require(rootOwnerAddress != address(0), "ComposableTopDown: ownerOf _tokenId zero address");
    }
    // Case 1: Token owner is this contract and token.
    while (rootOwnerAddress == address(this)) {
      (rootOwnerAddress, _childTokenId) = _ownerOfChild(rootOwnerAddress, _childTokenId);
    }
    bytes memory callData =
    abi.encodeWithSelector(
      ROOT_OWNER_OF_CHILD,
      address(this),
      _childTokenId
    );
    (bool callSuccess, bytes memory data) =
    rootOwnerAddress.staticcall(callData);
    if (callSuccess) {
      assembly {
        rootOwner := mload(add(data, 0x20))
      }
    }

    if (callSuccess == true && rootOwner & 0xffffffff00000000000000000000000000000000000000000000000000000000 == ERC998_MAGIC_VALUE_32) {
      // Case 2: Token owner is other top-down composable
      return rootOwner;
    } else {
      // Case 3: Token owner is other contract
      // Or
      // Case 4: Token owner is user
      assembly {
        rootOwner := or(ERC998_MAGIC_VALUE_32, rootOwnerAddress)
      }
    }
  }

  // returns the owner at the top of the tree of composables

  function approve(address to, uint256 _tokenId) public override virtual {
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    require(to != rootOwner, "ComposableTopDown: approval to current owner");

    require(
      _msgSender() == rootOwner ||
      isApprovedForAll(rootOwner, _msgSender()),
      "ComposableTopDown: approve caller is not owner nor approved for all"
    );
    rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] = to;
    emit Approval(rootOwner, to, _tokenId);
  }

  function getApproved(uint256 _tokenId) public view override virtual returns (address){
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    return rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId];
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override {
    if (_msgSender() != from) {
      bytes memory callData =
      abi.encodeWithSelector(
        ROOT_OWNER_OF_CHILD,
        address(this),
        tokenId
      );
      (bool callSuccess, bytes memory data) = from.staticcall(callData);
      if (callSuccess == true) {
        bytes32 rootOwner;
        assembly {
          rootOwner := mload(add(data, 0x20))
        }
        require(
          rootOwner & 0xffffffff00000000000000000000000000000000000000000000000000000000 != ERC998_MAGIC_VALUE_32,
          "ComposableTopDown: _transferFrom token is child of other top down composable"
        );
      }
    }

    super._beforeTokenTransfer(from, to, tokenId);
  }

  ////////////////////////////////////////////////////////
  // ERC998ERC721 and ERC998ERC721Enumerable implementation
  ////////////////////////////////////////////////////////

  // tokenId => child contract
  mapping(uint256 => EnumerableSet.AddressSet) private childContracts;

  // tokenId => (child address => array of child tokens)
  mapping(uint256 => mapping(address => EnumerableSet.UintSet)) private childTokens;

  // child address => childId => tokenId
  mapping(address => mapping(uint256 => uint256)) private childTokenOwner;

  function safeTransferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  ) external override {
    _transferChild(_fromTokenId, _to, _childContract, _childTokenId);
    IERC721(_childContract).safeTransferFrom(address(this), _to, _childTokenId);
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId);
  }

  function safeTransferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId,
    bytes memory _data
  ) external override {
    _transferChild(_fromTokenId, _to, _childContract, _childTokenId);
    IERC721(_childContract).safeTransferFrom(
      address(this),
      _to,
      _childTokenId,
      _data
    );
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId);
  }

  function transferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  ) external override {
    _transferChild(_fromTokenId, _to, _childContract, _childTokenId);
    // this is here to be compatible with cryptokitties and other old contracts that require being owner and approved
    // before transferring.
    // does not work with current standard which does not allow approving self, so we must let it fail in that case.
    bytes memory callData = abi.encodeWithSelector(APPROVE, this, _childTokenId);
    _childContract.call(callData);

    IERC721(_childContract).transferFrom(address(this), _to, _childTokenId);
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId);
  }

  function transferChildToParent(
    uint256 _fromTokenId,
    address _toContract,
    uint256 _toTokenId,
    address _childContract,
    uint256 _childTokenId,
    bytes memory _data
  ) external override {
    _transferChild(
      _fromTokenId,
      _toContract,
      _childContract,
      _childTokenId
    );
    emit TransferChild(
      _fromTokenId,
      _toContract,
      _childContract,
      _childTokenId
    );
    IERC998ERC721BottomUp(_childContract).transferToParent(
      address(this),
      _toContract,
      _toTokenId,
      _childTokenId,
      _data
    );
  }

  // this contract has to be approved first in _childContract
  function getChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) external override {
    receiveChild(_from, _tokenId, _childContract, _childTokenId);
    require(
      _from == _msgSender() ||
      IERC721(_childContract).isApprovedForAll(_from, _msgSender()) ||
      IERC721(_childContract).getApproved(_childTokenId) == _msgSender(),
      "ComposableTopDown: getChild _msgSender() not approved"
    );
    IERC721(_childContract).transferFrom(
      _from,
      address(this),
      _childTokenId
    );
    // a check for looped ownership chain
    rootOwnerOf(_tokenId);
  }

  function onERC721Received(
    address _from,
    uint256 _childTokenId,
    bytes calldata _data
  ) external returns (bytes4) {
    require(
      _data.length > 0,
      "ComposableTopDown: onERC721Received(3) _data must contain the uint256 tokenId to transfer the child token to"
    );
    // convert up to 32 bytes of _data to uint256, owner nft tokenId passed as uint in bytes
    uint256 tokenId = _parseTokenId(_data);
    receiveChild(_from, tokenId, _msgSender(), _childTokenId);
    require(
      IERC721(_msgSender()).ownerOf(_childTokenId) != address(0),
      "ComposableTopDown: onERC721Received(3) child token not owned"
    );
    // a check for looped ownership chain
    rootOwnerOf(tokenId);
    return ERC721_RECEIVED_OLD;
  }

  function onERC721Received(
    address,
    address _from,
    uint256 _childTokenId,
    bytes calldata _data
  ) external override returns (bytes4) {
    require(
      _data.length > 0,
      "ComposableTopDown: onERC721Received(4) _data must contain the uint256 tokenId to transfer the child token to"
    );
    // convert up to 32 bytes of _data to uint256, owner nft tokenId passed as uint in bytes
    uint256 tokenId = _parseTokenId(_data);
    receiveChild(_from, tokenId, _msgSender(), _childTokenId);
    require(
      IERC721(_msgSender()).ownerOf(_childTokenId) != address(0),
      "ComposableTopDown: onERC721Received(4) child token not owned"
    );
    // a check for looped ownership chain
    rootOwnerOf(tokenId);
    return ERC721_RECEIVED_NEW;
  }

  // ERC998ERC721TopDownEnumerable

  // @notice Get the total number of child contracts with tokens that are owned by tokenId.
  // @param _tokenId The parent token of child tokens in child contracts
  // @return uint256 The total number of child contracts with tokens owned by tokenId.
  function childExists(address _childContract, uint256 _childTokenId) external view returns (bool){
    uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
    return tokenId != 0;
  }

  function totalChildContracts(uint256 _tokenId) external view override returns (uint256){
    return childContracts[_tokenId].length();
  }

  // @notice Get child contract by tokenId and index
  // @param _tokenId The parent token of child tokens in child contract
  // @param _index The index position of the child contract
  // @return childContract The contract found at the tokenId and index.
  function childContractByIndex(uint256 _tokenId, uint256 _index) external view override returns (address childContract){
    return childContracts[_tokenId].at(_index);
  }

  // @notice Get the total number of child tokens owned by tokenId that exist in a child contract.
  // @param _tokenId The parent token of child tokens
  // @param _childContract The child contract containing the child tokens
  // @return uint256 The total number of child tokens found in child contract that are owned by tokenId.
  function totalChildTokens(uint256 _tokenId, address _childContract) external view override returns (uint256){
    return childTokens[_tokenId][_childContract].length();
  }

  // @notice Get child token owned by tokenId, in child contract, at index position
  // @param _tokenId The parent token of the child token
  // @param _childContract The child contract of the child token
  // @param _index The index position of the child token.
  // @return childTokenId The child tokenId for the parent token, child token and index
  function childTokenByIndex(
    uint256 _tokenId,
    address _childContract,
    uint256 _index
  ) external view override returns (uint256 childTokenId) {
    return childTokens[_tokenId][_childContract].at(_index);
  }

  function ownerOfChild(
    address _childContract,
    uint256 _childTokenId
  ) external view override returns (bytes32 parentTokenOwner, uint256 parentTokenId){
    parentTokenId = childTokenOwner[_childContract][_childTokenId];
    require(
      parentTokenId != 0,
      "ComposableTopDown: ownerOfChild not found"
    );
    address parentTokenOwnerAddress = ownerOf(parentTokenId);
    assembly {
      parentTokenOwner := or(ERC998_MAGIC_VALUE_32, parentTokenOwnerAddress)
    }

  }

  function _transferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  ) private {
    uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
    require(
      tokenId != 0,
      "ComposableTopDown: _transferChild _childContract _childTokenId not found"
    );
    require(
      tokenId == _fromTokenId,
      "ComposableTopDown: _transferChild wrong tokenId found"
    );
    require(
      _to != address(0),
      "ComposableTopDown: _transferChild _to zero address"
    );
    address rootOwner = address(uint160(uint256(rootOwnerOf(tokenId))));
    require(
      rootOwner == _msgSender() ||
        isApprovedForAll(rootOwner, _msgSender()) ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == _msgSender(),
      "ComposableTopDown: _transferChild _msgSender() not eligible"
    );
    removeChild(tokenId, _childContract, _childTokenId);
  }

  function _ownerOfChild(
    address _childContract,
    uint256 _childTokenId
  ) private view returns (address parentTokenOwner, uint256 parentTokenId) {
    parentTokenId = childTokenOwner[_childContract][_childTokenId];
    require(
      parentTokenId != 0,
      "ComposableTopDown: _ownerOfChild not found"
    );
    return (ownerOf(parentTokenId), parentTokenId);
  }

  function _parseTokenId(bytes memory _data) private pure returns (uint256 tokenId){
    // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
    assembly {
      tokenId := mload(add(_data, 0x20))
    }
    if (_data.length < 32) {
      tokenId = tokenId >> (256 - _data.length * 8);
    }
  }

  function removeChild(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) private {
    // remove child token
    uint256 lastTokenIndex =
    childTokens[_tokenId][_childContract].length() - 1;
    require(
      childTokens[_tokenId][_childContract].remove(_childTokenId),
      "ComposableTopDown: removeChild: _childTokenId not found"
    );
    delete childTokenOwner[_childContract][_childTokenId];

    // remove contract
    if (lastTokenIndex == 0) {
      require(
        childContracts[_tokenId].remove(_childContract),
        "ComposableTopDown: removeChild: _childContract not found"
      );
    }

    if (_childContract == address(this)) {
      _updateStateHash(_tokenId, uint256(uint160(_childContract)), tokenIdToStateHash[_childTokenId]);
    } else {
      _updateStateHash(_tokenId, uint256(uint160(_childContract)), _childTokenId);
    }
  }

  function receiveChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) private {
    require(
      ownerOf(_tokenId) != address(0),
      "ComposableTopDown: receiveChild _tokenId does not exist."
    );
    // @dev this is edge case, _tokenId can't be 0
    require(
      childTokenOwner[_childContract][_childTokenId] != _tokenId,
      "ComposableTopDown: receiveChild _childTokenId already received"
    );
    uint256 childTokensLength =
    childTokens[_tokenId][_childContract].length();
    if (childTokensLength == 0) {
      require(childContracts[_tokenId].add(_childContract), "ComposableTopDown: receiveChild: add _childContract");
    }
    require(childTokens[_tokenId][_childContract].add(_childTokenId), "ComposableTopDown: receiveChild: add _childTokenId");
    childTokenOwner[_childContract][_childTokenId] = _tokenId;
    if (_childContract == address(this)) {
      _updateStateHash(_tokenId, uint256(uint160(_childContract)), tokenIdToStateHash[_childTokenId]);
    } else {
      _updateStateHash(_tokenId, uint256(uint160(_childContract)), _childTokenId);
    }
    emit ReceivedChild(_from, _tokenId, _childContract, _childTokenId);
  }

  ////////////////////////////////////////////////////////
  // ERC998ERC223 and ERC998ERC223Enumerable implementation
  ////////////////////////////////////////////////////////

  // tokenId => token contract
  mapping(uint256 => EnumerableSet.AddressSet) erc20Contracts;

  // tokenId => (token contract => balance)
  mapping(uint256 => mapping(address => uint256)) erc20Balances;

  function transferERC20(
    uint256 _tokenId,
    address _to,
    address _erc20Contract,
    uint256 _value
  ) external override {
    require(
      _to != address(0),
      "ComposableTopDown: transferERC20 _to zero address"
    );
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    require(
      rootOwner == _msgSender() ||
      isApprovedForAll(rootOwner, _msgSender()) ||
      rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] ==
      _msgSender(),
      "ComposableTopDown: transferERC20 _msgSender() not eligible"
    );
    removeERC20(_tokenId, _erc20Contract, _value);
    require(
      IERC20AndERC223(_erc20Contract).transfer(_to, _value),
      "ComposableTopDown: transferERC20 transfer failed"
    );
    emit TransferERC20(_tokenId, _to, _erc20Contract, _value);
  }

  // implementation of ERC 223
  function transferERC223(
    uint256 _tokenId,
    address _to,
    address _erc223Contract,
    uint256 _value,
    bytes memory _data
  ) external override {
    require(
      _to != address(0),
      "ComposableTopDown: transferERC223 _to zero address"
    );
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    require(
      rootOwner == _msgSender() ||
      isApprovedForAll(rootOwner, _msgSender()) ||
      rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] ==
      _msgSender(),
      "ComposableTopDown: transferERC223 _msgSender() not eligible"
    );
    removeERC20(_tokenId, _erc223Contract, _value);
    require(
      IERC20AndERC223(_erc223Contract).transfer(_to, _value, _data),
      "ComposableTopDown: transferERC223 transfer failed"
    );
    emit TransferERC20(_tokenId, _to, _erc223Contract, _value);
  }

  // used by ERC 223
  function tokenFallback(
    address _from,
    uint256 _value,
    bytes memory _data
  ) external override {
    require(
      _data.length > 0,
      "ComposableTopDown: tokenFallback _data must contain the uint256 tokenId to transfer the token to"
    );
    require(
      tx.origin != _msgSender(),
      "ComposableTopDown: tokenFallback _msgSender() is not a contract"
    );
    uint256 tokenId = _parseTokenId(_data);
    erc20Received(_from, tokenId, _msgSender(), _value);
  }

  function balanceOfERC20(uint256 _tokenId, address _erc20Contract) external view override returns (uint256) {
    return erc20Balances[_tokenId][_erc20Contract];
  }

  function erc20ContractByIndex(uint256 _tokenId, uint256 _index) external view override returns (address){
    return erc20Contracts[_tokenId].at(_index);
  }

  function totalERC20Contracts(uint256 _tokenId) external view override returns (uint256){
    return erc20Contracts[_tokenId].length();
  }

  // this contract has to be approved first by _erc20Contract
  function getERC20(
    address _from,
    uint256 _tokenId,
    address _erc20Contract,
    uint256 _value
  ) public override {
    bool allowed = _from == _msgSender();
    if (!allowed) {
      bytes memory callData =
      abi.encodeWithSelector(ALLOWANCE, _from, _msgSender());
      (bool callSuccess, bytes memory data) =
      _erc20Contract.staticcall(callData);
      require(
        callSuccess,
        "ComposableTopDown: getERC20 allowance failed"
      );
      uint256 remaining;
      assembly {
        remaining := mload(add(data, 0x20))
      }
      require(
        remaining >= _value,
        "ComposableTopDown: getERC20 value greater than remaining"
      );
      allowed = true;
    }
    require(allowed, "ComposableTopDown: getERC20 not allowed to getERC20");
    erc20Received(_from, _tokenId, _erc20Contract, _value);
    require(
      IERC20AndERC223(_erc20Contract).transferFrom(
        _from,
        address(this),
        _value
      ),
      "ComposableTopDown: getERC20 transfer failed"
    );
  }

  function erc20Received(
    address _from,
    uint256 _tokenId,
    address _erc20Contract,
    uint256 _value
  ) private {
    require(ownerOf(_tokenId) != address(0), "ComposableTopDown: erc20Received _tokenId does not exist");
    if (_value == 0) {
      return;
    }
    uint256 erc20Balance = erc20Balances[_tokenId][_erc20Contract];
    if (erc20Balance == 0) {
      require(erc20Contracts[_tokenId].add(_erc20Contract), "ComposableTopDown: erc20Received: erc20Contracts add _erc20Contract");
    }
    erc20Balances[_tokenId][_erc20Contract] += _value;
    _updateStateHash(_tokenId, uint256(uint160(_erc20Contract)), erc20Balance + _value);
    emit ReceivedERC20(_from, _tokenId, _erc20Contract, _value);
  }

  function removeERC20(
    uint256 _tokenId,
    address _erc20Contract,
    uint256 _value
  ) private {
    if (_value == 0) {
      return;
    }
    uint256 erc20Balance = erc20Balances[_tokenId][_erc20Contract];
    require(erc20Balance >= _value, "ComposableTopDown: removeERC20 value not enough");
  unchecked {
    // overflow already checked
    uint256 newERC20Balance = erc20Balance - _value;
    erc20Balances[_tokenId][_erc20Contract] = newERC20Balance;
    if (newERC20Balance == 0) {
      require(erc20Contracts[_tokenId].remove(_erc20Contract), "ComposableTopDown: removeERC20: erc20Contracts remove _erc20Contract");
    }
    _updateStateHash(_tokenId, uint256(uint160(_erc20Contract)), newERC20Balance);
  }
  }

  ////////////////////////////////////////////////////////
  // ERC165 implementation
  ////////////////////////////////////////////////////////

  /**
   * @dev See {IERC165-supportsInterface}.
   * The interface id 0x1bc995e4 is added. The spec claims it to be the interface id of IERC998ERC721TopDown.
   * But it is not.
   * It is added anyway in case some contract checks it being compliant with the spec.
   */
  function supportsInterface(bytes4 interfaceId) public view override virtual returns (bool) {
    return
      interfaceId == type(IERC721).interfaceId ||
      interfaceId == type(IERC998ERC721TopDown).interfaceId ||
      interfaceId == type(IERC998ERC721TopDownEnumerable).interfaceId ||
      interfaceId == type(IERC998ERC20TopDown).interfaceId ||
      interfaceId == type(IERC998ERC20TopDownEnumerable).interfaceId ||
      interfaceId == 0x1bc995e4 ||
      super.supportsInterface(interfaceId);
  }

  ////////////////////////////////////////////////////////
  // Last State Hash
  ////////////////////////////////////////////////////////

  /**
   * Update the state hash of tokenId and all its ancestors.
   * @param tokenId token id
   * @param childReference generalization of a child contract adddress
   * @param value new balance of ERC20, childTokenId of ERC721 or a child's state hash (if childContract==address(this))
   */
  function _updateStateHash(uint256 tokenId, uint256 childReference, uint256 value) private {
    uint256 _newStateHash = uint256(keccak256(abi.encodePacked(tokenIdToStateHash[tokenId], childReference, value)));
    tokenIdToStateHash[tokenId] = _newStateHash;
    while (ownerOf(tokenId) == address(this)) {
      tokenId = childTokenOwner[address(this)][tokenId];
      _newStateHash = uint256(keccak256(abi.encodePacked(tokenIdToStateHash[tokenId], uint256(uint160(address(this))), _newStateHash)));
      tokenIdToStateHash[tokenId] = _newStateHash;
    }
  }

  function stateHash(uint256 tokenId) public view returns (uint256) {
    uint256 _stateHash = tokenIdToStateHash[tokenId];
    require(_stateHash > 0, "ComposableTopDown: stateHash of _tokenId is zero");
    return _stateHash;
  }

  /**
   * @dev See {safeTransferFrom}.
   * Check the state hash and call safeTransferFrom.
   */
  function safeCheckedTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    uint256 expectedStateHash
  ) external {
    require(expectedStateHash == tokenIdToStateHash[tokenId], "ComposableTopDown: stateHash mismatch (1)");
    safeTransferFrom(from, to, tokenId);
  }

  /**
   * @dev See {transferFrom}.
   * Check the state hash and call transferFrom.
   */
  function checkedTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    uint256 expectedStateHash
  ) external {
    require(expectedStateHash == tokenIdToStateHash[tokenId], "ComposableTopDown: stateHash mismatch (2)");
    transferFrom(from, to, tokenId);
  }

  /**
   * @dev See {safeTransferFrom}.
   * Check the state hash and call safeTransferFrom.
   */
  function safeCheckedTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    uint256 expectedStateHash,
    bytes calldata data
  ) external {
    require(expectedStateHash == tokenIdToStateHash[tokenId], "ComposableTopDown: stateHash mismatch (3)");
    safeTransferFrom(from, to, tokenId, data);
  }
}
