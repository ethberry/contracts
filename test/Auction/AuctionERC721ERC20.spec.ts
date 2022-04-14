import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { ContractFactory } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { AuctionERC721ERC20, ERC20ACBCS, ERC721ACB } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, tokenId, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("AuctionERC721ERC20", function () {
  let auction: ContractFactory;
  let auctionInstance: AuctionERC721ERC20;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACBCS;
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACB;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    erc721 = await ethers.getContractFactory("ERC721ACB");
    auction = await ethers.getContractFactory("AuctionERC721ERC20");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount * 10)) as ERC20ACBCS;
    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721ACB;
    auctionInstance = (await auction.deploy(erc20Instance.address)) as AuctionERC721ERC20;

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

      const tx1 = await auctionInstance.startAuction(
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

      const tx1 = await auctionInstance.startAuction(
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount);

      const tx4 = await auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const balance = await erc20Instance.balanceOf(auctionInstance.address);
      expect(balance).to.equal(amount);

      const balance1 = await erc20Instance.balanceOf(this.owner.address);
      expect(balance1).to.equal(0);

      const balance2 = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(0);
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount);

      const tx4 = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const tx5 = erc20Instance.mint(this.stranger.address, amount * 2);
      await expect(tx5)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.stranger.address, amount * 2);

      const tx6 = erc20Instance.connect(this.stranger).approve(auctionInstance.address, amount * 2);
      await expect(tx6)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.stranger.address, auctionInstance.address, amount * 2);

      const tx7 = auctionInstance.connect(this.stranger).makeBid(0, amount * 2);
      await expect(tx7)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 2);

      const balance = await erc20Instance.balanceOf(auctionInstance.address);
      expect(balance).to.equal(amount * 2);

      const balance1 = await erc20Instance.balanceOf(this.owner.address);
      expect(balance1).to.equal(0);

      const balance2 = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(amount);

      const balance3 = await erc20Instance.balanceOf(this.stranger.address);
      expect(balance3).to.equal(0);
    });

    it("should buyout", async function () {
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount * 3);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount * 3);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount * 3);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount * 3);

      const tx4 = await auctionInstance.connect(this.receiver).makeBid(0, amount * 3);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount * 3)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount * 3);

      const balance = await erc20Instance.balanceOf(auctionInstance.address);
      expect(balance).to.equal(0);

      const balance1 = await erc20Instance.balanceOf(this.owner.address);
      expect(balance1).to.equal(amount * 3);

      const balance2 = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(0);
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount);

      const tx4 = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const tx5 = erc20Instance.mint(this.stranger.address, amount * 3);
      await expect(tx5)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.stranger.address, amount * 3);

      const tx6 = erc20Instance.connect(this.stranger).approve(auctionInstance.address, amount * 3);
      await expect(tx6)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.stranger.address, auctionInstance.address, amount * 3);

      const tx7 = auctionInstance.connect(this.stranger).makeBid(0, amount * 3);
      await expect(tx7)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 3)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.stranger.address, erc721Instance.address, tokenId, amount * 3);

      const balance = await erc20Instance.balanceOf(auctionInstance.address);
      expect(balance).to.equal(0);

      const balance1 = await erc20Instance.balanceOf(this.owner.address);
      expect(balance1).to.equal(amount * 3);

      const balance2 = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(amount);

      const balance3 = await erc20Instance.balanceOf(this.stranger.address);
      expect(balance3).to.equal(0);
    });

    it("should fail: insufficient allowance", async function () {
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

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx2).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: transfer amount exceeds balance", async function () {
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

      const tx2 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount);

      const tx3 = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx3).to.be.revertedWith("ERC20: transfer amount exceeds balance");
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

      const tx2 = auctionInstance.connect(this.receiver).makeBid(1, amount);
      await expect(tx2).to.be.revertedWith("Auction: wrong auction id");
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
        timestamp + 1000,
        timestamp + span + span + 1000,
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
          timestamp + 1000,
          timestamp + span + span + 1000,
        );

      const bid = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(bid).to.be.revertedWith("Auction: auction is not yet started");
    });

    it("should fail: auction is already finished", async function () {
      const span = 100;
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

      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(span)));

      const bid = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(bid).to.be.revertedWith("Auction: auction is already finished");
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount * 3);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount * 3);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount * 3);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount * 3);

      const tx4 = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const bid1 = auctionInstance.connect(this.receiver).makeBid(0, amount * 2);
      await expect(bid1).to.be.revertedWith("Auction: prevent double spending");
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

      const tx2 = auctionInstance.makeBid(0, amount);
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

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, amount / 2);
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount * 3);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount * 3);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount * 3);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount * 3);

      const tx4 = await auctionInstance.connect(this.receiver).makeBid(0, amount * 3);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount * 3);

      const tx5 = erc20Instance.mint(this.stranger.address, amount * 2);
      await expect(tx5)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.stranger.address, amount * 2);

      const tx6 = erc20Instance.connect(this.stranger).approve(auctionInstance.address, amount * 2);
      await expect(tx6)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.stranger.address, auctionInstance.address, amount * 2);

      const tx7 = auctionInstance.connect(this.stranger).makeBid(0, amount * 2);
      await expect(tx7).to.be.revertedWith("Auction: proposed bid must be bigger than current bid");
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

      const tx2 = auctionInstance.connect(this.receiver).makeBid(0, amount + 1);
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

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const tx3 = erc20Instance.connect(this.receiver).approve(auctionInstance.address, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Approval")
        .withArgs(this.receiver.address, auctionInstance.address, amount);

      const tx4 = auctionInstance.connect(this.receiver).makeBid(0, amount);
      await expect(tx4)
        .to.emit(auctionInstance, "AuctionBid")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(300)));

      const tx5 = await auctionInstance.finishAuction(0);
      await expect(tx5)
        .to.emit(auctionInstance, "AuctionFinish")
        .withArgs(0, this.receiver.address, erc721Instance.address, tokenId, amount);

      const ownerOf1 = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf1).to.equal(this.receiver.address);

      const balance = await erc20Instance.balanceOf(auctionInstance.address);
      expect(balance).to.equal(0);

      const balance1 = await erc20Instance.balanceOf(this.owner.address);
      expect(balance1).to.equal(amount);

      const balance2 = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(0);
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
      await expect(tx3).to.be.revertedWith(`Pausable: paused`);

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
});
