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
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuctionERC20 is AccessControl, Pausable, ERC721Holder {
  using Address for address;
  using Counters for Counters.Counter;

  IERC20 private _acceptedToken;

  Counters.Counter private _auctionIdCounter;

  struct AuctionData {
    address _auctionCollection;
    uint256 _auctionTokenId;
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
    uint256 startPrice,
    uint256 bidStep,
    uint256 startTimestamp,
    uint256 finishTimestamp
  );

  event AuctionBid(uint256 auctionId, address from, uint256 tokenId, uint256 amount);
  event AuctionFinish(uint256 auctionId, address from, uint256 tokenId, uint256 amount);

  constructor(address acceptedToken) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    require(acceptedToken.isContract(), "The accepted token address must be a deployed contract");
    _acceptedToken = IERC20(acceptedToken);
  }

  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  function startAuction(
    address collection,
    uint256 tokenId,
    uint256 startPrice,
    uint256 bidStep,
    uint256 startAuctionTimestamp,
    uint256 finishAuctionTimestamp
  ) public whenNotPaused {
    require(collection != address(0), "Auction: collection address cannot be zero");
    require(startAuctionTimestamp < finishAuctionTimestamp, "Auction: auction start time should be less than end time");
    require(startPrice > 0, "Auction: auction start price should be positive");
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
      startPrice,
      bidStep,
      _startAuctionTimestamp,
      finishAuctionTimestamp
    );
  }

  function makeBid(uint256 auctionId, uint256 bid) public whenNotPaused {
    AuctionData storage auction = _auction[auctionId];
    require(auction._auctionCollection > address(0), "Auction: seems you tried wrong auction id");
    require(auction._auctionStartTimestamp <= block.timestamp, "Auction: auction is not yet started");
    require(auction._auctionFinishTimestamp >= block.timestamp, "Auction: auction is already finished");
    require(auction._auctionCurrentBidder != _msgSender(), "Auction: prevent double spending");
    require(auction._auctionSeller != _msgSender(), "Auction: prevent bidding on own items");

    require(auction._auctionStartPrice <= bid, "Auction: proposed bid can not be less than start price");
    require(auction._auctionCurrentBid < bid, "Auction: proposed bid must be bigger than current bid");

    uint256 currentBid = auction._auctionCurrentBid;
    address currentBidder = auction._auctionCurrentBidder;
    uint256 bidStep = auction._auctionBidStep;
    require((bid - auction._auctionStartPrice) % bidStep == 0, "Auction: bid must be a multiple of the bid step");

    auction._auctionCurrentBid = bid;
    auction._auctionCurrentBidder = _msgSender();

    _acceptedToken.transferFrom(_msgSender(), address(this), bid);

    if (currentBid != 0) {
      _acceptedToken.transfer(currentBidder, currentBid);
    }

    emit AuctionBid(auctionId, _msgSender(), auction._auctionTokenId, bid);
  }

  function finishAuction(uint256 auctionId) public whenNotPaused {
    AuctionData storage auction = _auction[auctionId];
    require(auction._auctionCollection != address(0), "Auction: seems you tried wrong auction id");
    require(auction._auctionStartTimestamp < block.timestamp, "Auction: auction is not yet started");
    require(auction._auctionFinishTimestamp <= block.timestamp, "Auction: auction is not finished");

    uint256 currentBid = auction._auctionCurrentBid;
    uint256 tokenId = auction._auctionTokenId;

    if (currentBid > 0) {
      _acceptedToken.transfer(auction._auctionSeller, currentBid);
      IERC721(auction._auctionCollection).safeTransferFrom(address(this), auction._auctionCurrentBidder, tokenId);
      emit AuctionFinish(auctionId, auction._auctionCurrentBidder, tokenId, currentBid);
    } else {
      IERC721(auction._auctionCollection).safeTransferFrom(address(this), auction._auctionSeller, tokenId);
      emit AuctionFinish(auctionId, auction._auctionSeller, tokenId, 0);
    }
  }
}
