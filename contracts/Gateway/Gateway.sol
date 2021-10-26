// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";


contract Gateway is AccessControl, Pausable, ReentrancyGuard, ERC721Holder, ERC1155Holder {
  using SafeERC20 for IERC20;

  IERC20 public erc20Token;
  IERC721Enumerable public erc721Token;
  IERC1155 public erc1155Token;

  event Deposited(address indexed from, uint256 amount);
  event Withdrawn(address indexed from, uint256 amount);
  event Transfer(address indexed from, uint256 amount);
  event DepositedErc20(address indexed from, uint256 amount);
  event WithdrawnErc20(address indexed from, uint256 amount);
  event DepositedErc721(address indexed from, uint256 tokenId);
  event WithdrawnErc721(address indexed from, uint256 tokenId);
  event TransferErc721(address indexed from, uint256 tokenId);
  event DepositedErc1155(address indexed from, uint256 tokenId, uint256 amount);
  event WithdrawnErc1155(address indexed from, uint256 tokenId, uint256 amount);

  constructor(address erc20Token_, address erc721Token_, address erc1155Token_) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    erc20Token = IERC20(erc20Token_);
    erc721Token = IERC721Enumerable(erc721Token_);
    erc1155Token = IERC1155(erc1155Token_);
  }

  /* ETH */

  receive() external payable whenNotPaused {
    emit Deposited(_msgSender(), msg.value);
  }

  function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 amount = address(this).balance;
    payable(_msgSender()).transfer(amount);
    emit Withdrawn(_msgSender(), amount);
  }

  function transferTo(address to, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
    payable(to).transfer(amount);
    emit Transfer(to, amount);
  }

  /* ERC20 */

  function depositErc20(uint256 amount) external nonReentrant whenNotPaused {
    require(amount > 0, "Cannot deposit 0");
    erc20Token.safeTransferFrom(_msgSender(), address(this), amount);
    emit DepositedErc20(_msgSender(), amount);
  }

  function withdrawErc20() public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 amount = erc20Token.balanceOf(address(this));
    erc20Token.safeTransfer(_msgSender(), amount);
    emit WithdrawnErc20(_msgSender(), amount);
  }

  /* ERC721 */

  function depositErc721(uint256 tokenId) external nonReentrant whenNotPaused {
    erc721Token.safeTransferFrom(_msgSender(), address(this), tokenId);
    emit DepositedErc721(_msgSender(), tokenId);
  }

  function withdrawErc721() public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 amount = erc721Token.balanceOf(address(this));
    for (uint256 i = 0; i < amount; i++) {
      uint256 tokenId = erc721Token.tokenOfOwnerByIndex(address(this), i);
      erc721Token.safeTransferFrom(address(this), _msgSender(), tokenId);
      emit WithdrawnErc721(_msgSender(), tokenId);
    }
  }

  function transferToErc721(address to, uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    erc721Token.safeTransferFrom(address(this), to, tokenId);
    emit TransferErc721(to, tokenId);
  }

  /* ERC1155 */

  function depositErc1155(uint256 tokenId, uint256 amount) external nonReentrant whenNotPaused {
    erc1155Token.safeTransferFrom(
      _msgSender(),
      address(this),
      tokenId,
      amount,
      ""
    );
    emit DepositedErc1155(_msgSender(), tokenId, amount);
  }

  function withdrawErc1155() public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    // TODO implement
  }

  /* Overrides  */

  function supportsInterface(bytes4 interfaceId)
  public
  view
  virtual
  override(AccessControl, ERC1155Receiver)
  returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

}
