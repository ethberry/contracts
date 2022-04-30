// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuctionERC721ETH is AccessControl, Pausable, ERC721Holder {
  using Address for address;
  using Counters for Counters.Counter;

  Counters.Counter private _auctionIdCounter;
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  struct AuctionData {
    address _auctionCollection;
    uint256 _auctionTokenId;
    uint256 _auctionBuyoutPrice;
    uint256 _auctionStartPrice;
    uint256 _auctionBidStep;
    uint256 _auctionCurrentBid;
    address _auctionCurrentBidder;
    address _auctionSeller;
    uint256 _auctionStartTimestamp;
    uint256 _auctionFinishTimestamp;
  }

  mapping(uint256 => AuctionData) private _auction;

  event AuctionStart(
    uint256 auctionId,
    address owner,
    address collection,
    uint256 tokenId,
    uint256 buyoutPrice,
    uint256 startPrice,
    uint256 bidStep,
    uint256 startTimestamp,
    uint256 finishTimestamp
  );
  event AuctionBid(uint256 auctionId, address owner, address collection, uint256 tokenId, uint256 amount);
  event AuctionFinish(uint256 auctionId, address owner, address collection, uint256 tokenId, uint256 amount);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function startAuction(
    address collection,
    uint256 tokenId,
    uint256 buyoutPrice,
    uint256 startPrice,
    uint256 bidStep,
    uint256 startAuctionTimestamp,
    uint256 finishAuctionTimestamp
  ) public virtual whenNotPaused {
    require(collection != address(0), "Auction: collection address cannot be zero");
    require(startAuctionTimestamp < finishAuctionTimestamp, "Auction: auction start time should be less than end time");
    require(startPrice > 0, "Auction: auction start price should be greater than zero");
    require(startPrice < buyoutPrice, "Auction: auction start price should less than buyout price");
    require(block.timestamp < finishAuctionTimestamp, "Auction: auction should finished in future");

    IERC721(collection).safeTransferFrom(_msgSender(), address(this), tokenId);

    uint256 auctionId = _auctionIdCounter.current();
    _auctionIdCounter.increment();

    uint256 _startAuctionTimestamp;
    if (startAuctionTimestamp == 0) {
      _startAuctionTimestamp = block.timestamp;
    } else {
      _startAuctionTimestamp = startAuctionTimestamp;
    }

    _auction[auctionId] = AuctionData(
      collection,
      tokenId,
      buyoutPrice,
      startPrice,
      bidStep,
      0,
      address(0),
      _msgSender(),
      _startAuctionTimestamp,
      finishAuctionTimestamp
    );

    emit AuctionStart(
      auctionId,
      _msgSender(),
      collection,
      tokenId,
      buyoutPrice,
      startPrice,
      bidStep,
      _startAuctionTimestamp,
      finishAuctionTimestamp
    );
  }

  function makeBid(uint256 auctionId) public payable virtual whenNotPaused {
    AuctionData storage auction = _auction[auctionId];
    require(auction._auctionCollection != address(0), "Auction: wrong auction id");
    require(auction._auctionStartTimestamp <= block.timestamp, "Auction: auction is not yet started");
    require(auction._auctionFinishTimestamp >= block.timestamp, "Auction: auction is already finished");
    require(auction._auctionCurrentBidder != _msgSender(), "Auction: prevent double spending");
    require(auction._auctionSeller != _msgSender(), "Auction: prevent bidding on own items");

    uint256 bid = msg.value;
    require(auction._auctionStartPrice <= bid, "Auction: proposed bid can not be less than start price");
    require(auction._auctionCurrentBid < bid, "Auction: proposed bid must be bigger than current bid");

    uint256 currentBid = auction._auctionCurrentBid;
    address currentBidder = auction._auctionCurrentBidder;
    uint256 bidStep = auction._auctionBidStep;
    require((bid - auction._auctionStartPrice) % bidStep == 0, "Auction: bid must be a multiple of the bid step");

    auction._auctionCurrentBid = bid;
    auction._auctionCurrentBidder = _msgSender();

    currentBidder.call{ value: currentBid }("");

    emit AuctionBid(auctionId, _msgSender(), auction._auctionCollection, auction._auctionTokenId, bid);

    if (bid >= auction._auctionBuyoutPrice) {
      _finish(auctionId);
    }
  }

  function finishAuction(uint256 auctionId) public virtual whenNotPaused {
    AuctionData storage auction = _auction[auctionId];
    require(auction._auctionCollection != address(0), "Auction: wrong auction id");
    require(auction._auctionStartTimestamp < block.timestamp, "Auction: auction is not yet started");
    require(auction._auctionFinishTimestamp <= block.timestamp, "Auction: auction is not finished");

    _finish(auctionId);
  }

  function _finish(uint256 auctionId) internal virtual {
    AuctionData storage auction = _auction[auctionId];

    address currentBidder = auction._auctionCurrentBidder;
    address collection = auction._auctionCollection;
    uint256 tokenId = auction._auctionTokenId;
    uint256 currentBid = auction._auctionCurrentBid;
    address seller = auction._auctionSeller;

    if (currentBid > 0) {
      seller.call{ value: currentBid }("");
      IERC721(collection).safeTransferFrom(address(this), currentBidder, tokenId);
      emit AuctionFinish(auctionId, currentBidder, collection, tokenId, currentBid);
    } else {
      IERC721(collection).safeTransferFrom(address(this), seller, tokenId);
      emit AuctionFinish(auctionId, seller, collection, tokenId, 0);
    }
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
