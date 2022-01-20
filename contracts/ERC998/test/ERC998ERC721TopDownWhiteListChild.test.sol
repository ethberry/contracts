// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IERC998ERC721TopDown.sol";
import "../interfaces/IERC998ERC721TopDownEnumerable.sol";

import "../../ERC721/preset/ERC721ACBECS.sol";
import "../../AccessList/WhiteListChild.sol";

contract ERC998ERC721TopDownWhiteListChildTest is ERC721ACBECS, IERC998ERC721TopDown, IERC998ERC721TopDownEnumerable, WhiteListChild {
  using Address for address;
  using Counters for Counters.Counter;
  using EnumerableSet for EnumerableSet.UintSet;
  using EnumerableSet for EnumerableSet.AddressSet;

  // return this.rootOwnerOf.selector ^ this.rootOwnerOfChild.selector ^
  //   this.tokenOwnerOf.selector ^ this.ownerOfChild.selector;
  bytes4 constant ERC998_MAGIC_VALUE = 0xcd740db5;
  bytes32 constant ERC998_MAGIC_VALUE_32 = 0xcd740db500000000000000000000000000000000000000000000000000000000;

  // root token owner address => (tokenId => approved address)
  mapping(address => mapping(uint256 => address)) private rootOwnerAndTokenIdToApprovedAddress;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 cap
  ) ERC721ACBECS(name, symbol, baseTokenURI, cap) {
    // burn first token because of reasons
    // mint(0x000000000000000000000000000000000000dead);
  }

  bytes4 constant APPROVE = bytes4(keccak256("approve(address,uint256)"));
  bytes4 constant ROOT_OWNER_OF_CHILD = bytes4(keccak256("rootOwnerOfChild(address,uint256)"));

  function rootOwnerOf(uint256 _tokenId) public override view returns (bytes32 rootOwner) {
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
    }
    // Case 1: Token owner is this contract and token.
    while (rootOwnerAddress == address(this)) {
      (rootOwnerAddress, _childTokenId) = _ownerOfChild(rootOwnerAddress, _childTokenId);
    }
    bytes memory callData = abi.encodeWithSelector(ROOT_OWNER_OF_CHILD, address(this), _childTokenId);
    (bool callSuccess, bytes memory data) = rootOwnerAddress.staticcall(callData);
    if (callSuccess) {
      assembly {
        rootOwner := mload(add(data, 0x20))
      }
    }

    if (
      callSuccess == true &&
      rootOwner & 0xffffffff00000000000000000000000000000000000000000000000000000000 == ERC998_MAGIC_VALUE_32
    ) {
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

  function approve(address to, uint256 _tokenId) public override {
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    require(to != rootOwner, "ComposableTopDown: approval to current owner");

    require(
      _msgSender() == rootOwner || isApprovedForAll(rootOwner, _msgSender()),
      "ComposableTopDown: approve caller is not owner nor approved for all"
    );
    rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] = to;
    emit Approval(rootOwner, to, _tokenId);
  }

  function getApproved(uint256 _tokenId) public view override returns (address) {
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    return rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId];
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override {
    if (_msgSender() != from) {
      bytes memory callData = abi.encodeWithSelector(ROOT_OWNER_OF_CHILD, address(this), tokenId);
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
    IERC721(_childContract).safeTransferFrom(address(this), _to, _childTokenId, _data);
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId);
  }

  function transferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  ) external override {
    _transferChild(_fromTokenId, _to, _childContract, _childTokenId);
    IERC721(_childContract).transferFrom(address(this), _to, _childTokenId);
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId);
  }

  function transferChildToParent(
    uint256,
    address,
    uint256,
    address,
    uint256,
    bytes memory
  ) external pure override {
    revert("ERC998ERC721TopDown: this method is not supported");
  }

  function getChild(
    address,
    uint256,
    address,
    uint256
  ) external pure override {
    revert("ERC998ERC721TopDown: this method is not supported");
  }

  function onERC721Received(
    address,
    address _from,
    uint256 _childTokenId,
    bytes calldata _data
  ) external override returns (bytes4) {
    require(
      _data.length > 0,
      "ComposableTopDown: onERC721Received _data must contain the uint256 tokenId to transfer the child token to"
    );
    // convert up to 32 bytes of _data to uint256, owner nft tokenId passed as uint in bytes
    uint256 tokenId = _parseTokenId(_data);
    receiveChild(_from, tokenId, _msgSender(), _childTokenId);
    require(
      IERC721(_msgSender()).ownerOf(_childTokenId) != address(0),
      "ComposableTopDown: onERC721Received child token not owned"
    );
    // a check for looped ownership chain
    rootOwnerOf(tokenId);
    return this.onERC721Received.selector;
  }

  // ERC998ERC721TopDownEnumerable

  function childExists(address _childContract, uint256 _childTokenId) external view returns (bool) {
    uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
    return tokenId != 0;
  }

  function totalChildContracts(uint256 _tokenId) external view override returns (uint256) {
    return childContracts[_tokenId].length();
  }

  function childContractByIndex(uint256 _tokenId, uint256 _index)
    external
    view
    override
    returns (address childContract)
  {
    return childContracts[_tokenId].at(_index);
  }

  function totalChildTokens(uint256 _tokenId, address _childContract) external view override returns (uint256) {
    return childTokens[_tokenId][_childContract].length();
  }

  function childTokenByIndex(
    uint256 _tokenId,
    address _childContract,
    uint256 _index
  ) external view override returns (uint256 childTokenId) {
    return childTokens[_tokenId][_childContract].at(_index);
  }

  function ownerOfChild(address _childContract, uint256 _childTokenId)
    external
    view
    override
    returns (bytes32 parentTokenOwner, uint256 parentTokenId)
  {
    parentTokenId = childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId != 0, "ComposableTopDown: ownerOfChild not found");
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
    require(tokenId != 0, "ComposableTopDown: _transferChild _childContract _childTokenId not found");
    require(tokenId == _fromTokenId, "ComposableTopDown: _transferChild wrong tokenId found");
    require(_to != address(0), "ComposableTopDown: _transferChild _to zero address");
    address rootOwner = address(uint160(uint256(rootOwnerOf(tokenId))));
    require(
      rootOwner == _msgSender() ||
        isApprovedForAll(rootOwner, _msgSender()) ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == _msgSender(),
      "ComposableTopDown: _transferChild _msgSender() not eligible"
    );
    removeChild(tokenId, _childContract, _childTokenId);
  }

  function _ownerOfChild(address _childContract, uint256 _childTokenId)
    private
    view
    returns (address parentTokenOwner, uint256 parentTokenId)
  {
    parentTokenId = childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId != 0, "ComposableTopDown: _ownerOfChild not found");
    return (ownerOf(parentTokenId), parentTokenId);
  }

  function _parseTokenId(bytes memory _data) private pure returns (uint256 tokenId) {
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
  ) private onlyWhiteListedWhithDecrement(_childContract) {
    // remove child token
    uint256 lastTokenIndex = childTokens[_tokenId][_childContract].length() - 1;
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
  }

  function receiveChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) private onlyWhiteListedWhithIncrement(_childContract) {
    require(ownerOf(_tokenId) != address(0), "ComposableTopDown: receiveChild _tokenId does not exist.");
    // @dev this is edge case, _tokenId can't be 0
    require(
      childTokenOwner[_childContract][_childTokenId] != _tokenId,
      "ComposableTopDown: receiveChild _childTokenId already received"
    );
    uint256 childTokensLength = childTokens[_tokenId][_childContract].length();
    if (childTokensLength == 0) {
      require(childContracts[_tokenId].add(_childContract), "ComposableTopDown: receiveChild: add _childContract");
    }
    require(
      childTokens[_tokenId][_childContract].add(_childTokenId),
      "ComposableTopDown: receiveChild: add _childTokenId"
    );
    childTokenOwner[_childContract][_childTokenId] = _tokenId;
    emit ReceivedChild(_from, _tokenId, _childContract, _childTokenId);
  }

  function whiteListChild(address addr) public onlyRole(DEFAULT_ADMIN_ROLE){
    _whiteListChild(addr);
  }

  function unWhitelistChild(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unWhitelistChild(addr);
  }

  function setMaxChild(uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setMaxChild(max);
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
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC998ERC721TopDown).interfaceId ||
      interfaceId == type(IERC998ERC721TopDownEnumerable).interfaceId ||
      interfaceId == 0x1bc995e4 ||
      super.supportsInterface(interfaceId);
  }
}
