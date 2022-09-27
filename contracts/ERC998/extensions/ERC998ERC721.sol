// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./ERC998Utils.sol";
import "../interfaces/IERC998ERC721TopDown.sol";
import "../interfaces/IERC998TopDown.sol";

abstract contract ERC998ERC721 is Context, ERC165, IERC721, IERC998TopDown, IERC998ERC721TopDown, ERC998Utils {
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

  bytes4 constant ROOT_OWNER_OF_CHILD = bytes4(keccak256("rootOwnerOfChild(address,uint256)"));

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
    }
    // Case 1: Token owner is this contract and token.
    address rootOwnerAddress_ = rootOwnerAddress;
    uint256 childTokenId_ = _childTokenId;
    while (rootOwnerAddress == address(this)) {
      (rootOwnerAddress, _childTokenId) = _ownerOfChild(rootOwnerAddress, _childTokenId);
      require(
        !(rootOwnerAddress_ == rootOwnerAddress && childTokenId_ == _childTokenId),
        "CTD: circular ownership is forbidden"
      );
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

  function approve(address to, uint256 _tokenId) public virtual override {
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    require(to != rootOwner, "CTD: approval to current owner");

    require(
      _msgSender() == rootOwner || isApprovedForAll(rootOwner, _msgSender()),
      "CTD: approve caller is not owner nor approved for all"
    );
    rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] = to;
    emit Approval(rootOwner, to, _tokenId);
  }

  function getApproved(uint256 _tokenId) public view virtual override returns (address) {
    address rootOwner = address(uint160(uint256(rootOwnerOf(_tokenId))));
    return rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId];
  }

  function _beforeTokenTransfer(
    address from,
    address,
    uint256 tokenId
  ) internal virtual {
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
          "CTD: _transferFrom token is child of other top down composable"
        );
      }
    }
  }

  ////////////////////////////////////////////////////////
  // ERC998ERC721 and ERC998ERC721Enumerable implementation
  ////////////////////////////////////////////////////////

  // tokenId => child contract
  mapping(uint256 => EnumerableSet.AddressSet) internal childContracts;

  // tokenId => (child address => array of child tokens)
  mapping(uint256 => mapping(address => EnumerableSet.UintSet)) internal childTokens;

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
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId, 1);
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
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId, 1);
  }

  function transferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  ) external override {
    _transferChild(_fromTokenId, _to, _childContract, _childTokenId);
    IERC721(_childContract).transferFrom(address(this), _to, _childTokenId);
    emit TransferChild(_fromTokenId, _to, _childContract, _childTokenId, 1);
  }

  function transferChildToParent(
    uint256,
    address,
    uint256,
    address,
    uint256,
    bytes memory
  ) external pure override {
    revert("CTD: this method is not supported");
  }

  function getChild(
    address,
    uint256,
    address,
    uint256
  ) external pure override {
    revert("CTD: this method is not supported");
  }

  function onERC721Received(
    address,
    address _from,
    uint256 _childTokenId,
    bytes calldata _data
  ) external override returns (bytes4) {
    require(
      _data.length > 0,
      "CTD: onERC721Received _data must contain the uint256 tokenId to transfer the child token to"
    );
    // convert up to 32 bytes of _data to uint256, owner nft tokenId passed as uint in bytes
    uint256 tokenId = _parseTokenId(_data);
    receiveChild(_from, tokenId, _msgSender(), _childTokenId);
    require(IERC721(_msgSender()).ownerOf(_childTokenId) != address(0), "CTD: onERC721Received child token not owned");
    // a check for looped ownership chain
    rootOwnerOf(tokenId);
    return this.onERC721Received.selector;
  }

  function childExists(address _childContract, uint256 _childTokenId) external view returns (bool) {
    uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
    return tokenId != 0;
  }

  function ownerOfChild(address _childContract, uint256 _childTokenId)
    external
    view
    override
    returns (bytes32 parentTokenOwner, uint256 parentTokenId)
  {
    parentTokenId = childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId != 0, "CTD: ownerOfChild not found");
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
    require(tokenId != 0, "CTD: _transferChild _childContract _childTokenId not found");
    require(tokenId == _fromTokenId, "CTD: _transferChild wrong tokenId found");
    require(_to != address(0), "CTD: _transferChild _to zero address");

    address sender = _msgSender();
    _ownerOrApproved(sender, tokenId);

    removeChild(tokenId, _childContract, _childTokenId);
  }

  function _ownerOfChild(address _childContract, uint256 _childTokenId)
    private
    view
    returns (address parentTokenOwner, uint256 parentTokenId)
  {
    parentTokenId = childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId != 0, "CTD: _ownerOfChild not found");
    return (ownerOf(parentTokenId), parentTokenId);
  }

  function removeChild(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {
    // remove child token
    uint256 lastTokenIndex = childTokens[_tokenId][_childContract].length() - 1;
    require(childTokens[_tokenId][_childContract].remove(_childTokenId), "CTD: removeChild: _childTokenId not found");

    _beforeRemoveERC721(_tokenId, _childContract, _childTokenId);

    delete childTokenOwner[_childContract][_childTokenId];

    // remove contract
    if (lastTokenIndex == 0) {
      require(childContracts[_tokenId].remove(_childContract), "CTD: removeChild: _childContract not found");
    }

    _afterRemoveERC721(_tokenId, _childContract, _childTokenId);
  }

  function _beforeRemoveERC721(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {}

  function _afterRemoveERC721(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {}

  function receiveChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {
    require(ownerOf(_tokenId) != address(0), "CTD: receiveChild _tokenId does not exist.");
    // @dev this is edge case, _tokenId can't be 0
    require(
      childTokenOwner[_childContract][_childTokenId] != _tokenId,
      "CTD: receiveChild _childTokenId already received"
    );
    uint256 childTokensLength = childTokens[_tokenId][_childContract].length();
    if (childTokensLength == 0) {
      require(childContracts[_tokenId].add(_childContract), "CTD: receiveChild: add _childContract");
    }
    require(childTokens[_tokenId][_childContract].add(_childTokenId), "CTD: receiveChild: add _childTokenId");

    _beforeReceiveERC721(_from, _tokenId, _childContract, _childTokenId);

    childTokenOwner[_childContract][_childTokenId] = _tokenId;
    emit ReceivedChild(_from, _tokenId, _childContract, _childTokenId, 1);

    _afterReceiveERC721(_from, _tokenId, _childContract, _childTokenId);
  }

  function _beforeReceiveERC721(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {}

  function _afterReceiveERC721(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {}

  function childContractsFor(uint256 tokenId) external view returns (address[] memory) {
    address[] memory _childContracts = new address[](childContracts[tokenId].length());

    for (uint256 i = 0; i < childContracts[tokenId].length(); i++) {
      _childContracts[i] = childContracts[tokenId].at(i);
    }

    return _childContracts;
  }

  function _localRootId(uint256 tokenId) internal view virtual returns (uint256) {
    while (ownerOf(tokenId) == address(this)) {
      tokenId = childTokenOwner[address(this)][tokenId];
    }
    return tokenId;
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
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    return
      interfaceId == type(IERC998ERC721TopDown).interfaceId ||
      interfaceId == 0x1bc995e4 ||
      super.supportsInterface(interfaceId);
  }

  ////////////////////////////////////////////////////////
  // ERC721 mock
  ////////////////////////////////////////////////////////

  function ownerOf(uint256 tokenId) public view virtual override returns (address);

  function isApprovedForAll(address owner, address operator) public view virtual override returns (bool);

  function _ownerOrApproved(address sender, uint256 tokenId) internal view virtual override {
    address rootOwner = address(uint160(uint256(rootOwnerOf(tokenId))));
    require(
      rootOwner == sender ||
        isApprovedForAll(rootOwner, sender) ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == sender,
      "CTD: sender is not approved"
    );
  }
}
