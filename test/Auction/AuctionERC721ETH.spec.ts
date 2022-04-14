import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { ContractFactory } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { AuctionERC721ETH, AuctionPaymentReverter, ERC721ACB } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, tokenId, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("AuctionERC721ETH", function () {
  let auction: ContractFactory;
  let auctionInstance: AuctionERC721ETH;
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACB;
  let paymentReverter: ContractFactory;
  let paymentReverterInstance: AuctionPaymentReverter;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACB");
    auction = await ethers.getContractFactory("AuctionERC721ETH");
    paymentReverter = await ethers.getContractFactory("AuctionPaymentReverter");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721ACB;
    auctionInstance = (await auction.deploy()) as AuctionERC721ETH;
    paymentReverterInstance = (await paymentReverter.deploy(auctionInstance.address)) as AuctionPaymentReverter;

    await erc721Instance.mint(this.owner.address, tokenId);
    await erc721Instance.approve(auctionInstance.address, tokenId);

    this.contractInstance = auctionInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("startAuction", function () {
    it("should start auction (collection this.owner)", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(auctionInstance.address);
    });

    it("should start auction (if startAuctionTimestamp == 0, startAuctionTimestamp should block.timestamp)", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        0,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp + 1,
          timestamp + span + span,
        );

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(auctionInstance.address);
    });

    it("should fail: transfer from incorrect owner", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance
        .connect(this.stranger)
        .startAuction(erc721Instance.address, tokenId, amount * 3, amount, 1000, timestamp, timestamp + span + span);
      await expect(tx1).to.be.revertedWith("ERC721: transfer from incorrect owner");
    });

    it("should fail: operator query for nonexistent token", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId + 1,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith("ERC721: operator query for nonexistent token");
    });

    it("should fail: collection address cannot be zero", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        ethers.constants.AddressZero,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith("Auction: collection address cannot be zero");
    });

    it("should fail: auction start time should be less than end time", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp + span + span,
        timestamp,
      );
      await expect(tx1).to.be.revertedWith("Auction: auction start time should be less than end time");
    });

    it("should fail: auction start price should be greater than zero", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        0,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith("Auction: auction start price should be greater than zero");
    });

    it("should fail: auction start price should less than buyout price", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount / 2,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith("Auction: auction start price should less than buyout price");
    });

    it("should fail: auction should finished in future", async function () {
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp - 1000,
        timestamp - 100,
      );
      await expect(tx1).to.be.revertedWith("Auction: auction should finished in future");
    });
  });

  describe("makeBid", function () {
    it("should make bid", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const bid = await auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(bid)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      await expect(bid).to.changeEtherBalance(this.receiver, -amount);
    });

    it("should make another bid", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = await auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      await expect(tx2).to.changeEtherBalance(this.receiver, -amount);

      const tx3 = await auctionInstance.connect(this.stranger).makeBid(0, { value: amount * 2 });
      await expect(tx3)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 2);

      await expect(tx3).to.changeEtherBalances([this.owner, this.receiver, this.stranger], [0, amount, -amount * 2]);
    });

    it("should buyout", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const bid = await auctionInstance.connect(this.receiver).makeBid(0, { value: amount * 3 });
      await expect(bid)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount * 3)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount * 3);

      await expect(bid).to.changeEtherBalances([this.owner, this.receiver], [amount * 3, -amount * 3]);
    });

    it("should buyout after another bid", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = await auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      await expect(tx2).to.changeEtherBalance(this.receiver, -amount);

      const tx3 = await auctionInstance.connect(this.stranger).makeBid(0, { value: amount * 3 });
      await expect(tx3)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 3)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 3);

      await expect(tx3).to.changeEtherBalances(
        [this.owner, this.receiver, this.stranger],
        [amount * 3, amount, -amount * 3],
      );
    });

    it("should fail: wrong auction id", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = auctionInstance.connect(this.receiver).makeBid(1, { value: amount });
      await expect(tx2).to.be.revertedWith("Auction: wrong auction id");
    });

    it("should fail: auction is not yet started", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp + 1000,
        timestamp + span + span + 1000,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp + 1000,
          timestamp + span + span + 1000,
        );

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2).to.be.revertedWith("Auction: auction is not yet started");
    });

    it("should fail: auction is already finished", async function () {
      const span = 100;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span,
        );

      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(span)));

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2).to.be.revertedWith("Auction: auction is already finished");
    });

    it("should fail: prevent double spending", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const tx3 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx3).to.be.revertedWith("Auction: prevent double spending");
    });

    it("should fail: prevent bidding on own items", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = auctionInstance.makeBid(0, { value: amount });
      await expect(tx2).to.be.revertedWith("Auction: prevent bidding on own items");
    });

    it("should fail: proposed bid can not be less than start price", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount / 2 });
      await expect(tx2).to.be.revertedWith("Auction: proposed bid can not be less than start price");
    });

    it("should fail: proposed bid must be bigger than current bid", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const tx3 = auctionInstance.connect(this.stranger).makeBid(0, { value: amount });
      await expect(tx3).to.be.revertedWith("Auction: proposed bid must be bigger than current bid");
    });

    it("should fail: bid must be a multiple of the bid step", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount + 1 });
      await expect(tx2).to.be.revertedWith("Auction: bid must be a multiple of the bid step");
    });
  });

  describe("finishAuction", function () {
    it("should finish auction without bids", async function () {
      const span = 200;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span,
        );

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(auctionInstance.address);

      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(200)));

      const finish = auctionInstance.finishAuction(0);
      await expect(finish)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.owner.address, erc721Instance.address, tokenId, 0);

      const ownerOf1 = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf1).to.equal(this.owner.address);
    });

    it("should finish auction with bid", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span,
        );

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(auctionInstance.address);

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(300)));

      const tx3 = await auctionInstance.finishAuction(0);
      await expect(tx3)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      await expect(tx3).to.changeEtherBalance(this.owner, amount);

      const ownerOf1 = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf1).to.equal(this.receiver.address);
    });

    it("should fail: wrong auction id", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span,
        );

      const finish = auctionInstance.finishAuction(1);
      await expect(finish).to.be.revertedWith("Auction: wrong auction id");
    });

    it("should fail: auction is not yet started", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp + span,
        timestamp + span + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp + span,
          timestamp + span + span,
        );

      const finish = auctionInstance.finishAuction(0);
      await expect(finish).to.be.revertedWith("Auction: auction is not yet started");
    });

    it("should fail: auction is not finished", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const finish = auctionInstance.finishAuction(0);
      await expect(finish).to.be.revertedWith("Auction: auction is not finished");
    });
  });

  describe("pause", function () {
    it("should fail: paase not admin", async function () {
      const tx = auctionInstance.connect(this.receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should fail: unpause not admin", async function () {
      const tx = auctionInstance.connect(this.receiver).unpause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span,
        );

      const tx2 = auctionInstance.pause();
      await expect(tx2).to.emit(auctionInstance, "Paused").withArgs(this.owner.address);

      const tokenId1 = tokenId + 1;
      await erc721Instance.mint(this.owner.address, tokenId1);
      await erc721Instance.approve(auctionInstance.address, tokenId1);

      const tx3 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId1,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx3).to.be.revertedWith("Pausable: paused");

      const tx4 = auctionInstance.unpause();
      await expect(tx4).to.emit(auctionInstance, "Unpaused").withArgs(this.owner.address);

      const tx5 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId1,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span,
      );
      await expect(tx5).to.not.be.reverted;
    });
  });

  describe("VULNERABILITIES", function () {
    it("should not block auction", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount * 3,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          this.owner.address,
          erc721Instance.address,
          tokenId,
          amount * 3,
          amount,
          1000,
          timestamp,
          timestamp + span + span,
        );

      const tx2 = await paymentReverterInstance.connect(this.receiver).makeBid(0, { value: amount });
      await expect(tx2)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, paymentReverterInstance.address, erc721Instance.address, tokenId, amount);

      await expect(tx2).to.changeEtherBalance(this.receiver, -amount);

      const tx3 = await auctionInstance.connect(this.stranger).makeBid(0, { value: amount * 2 });
      await expect(tx3)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 2);

      await expect(tx3).to.changeEtherBalances([this.owner, this.receiver, this.stranger], [0, 0, -amount * 2]);
    });
  });
});
