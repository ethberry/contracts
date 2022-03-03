import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@openzeppelin/test-helpers";

import { AuctionERC20, ERC20ACBCS, ERC721ACB } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, tokenId, tokenName, tokenSymbol } from "../constants";

describe("AuctionERC20", function () {
  let auction: ContractFactory;
  let auctionInstance: AuctionERC20;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACBCS;
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACB;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let stranger: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    erc721 = await ethers.getContractFactory("ERC721ACB");
    auction = await ethers.getContractFactory("AuctionERC20");
    [owner, receiver, stranger] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ACBCS;
    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721ACB;
    auctionInstance = (await auction.deploy(erc20Instance.address)) as AuctionERC20;

    await erc721Instance.mint(owner.address, tokenId);
    await erc721Instance.approve(auctionInstance.address, tokenId);

    const approveAddress = await erc721Instance.getApproved(tokenId);
    expect(auctionInstance.address).to.equal(approveAddress);
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await auctionInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });

  describe("startAuction", function () {
    it("should start auction (collection owner)", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(0, owner.address, erc721Instance.address, tokenId, amount, 1000, timestamp, timestamp + span + span);

      const ownerOf = await erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(auctionInstance.address);
    });

    it("should start auction (if startAuctionTimestamp == 0, startAuctionTimestamp should block.timestamp)", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount,
        1000,
        0,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(
          0,
          owner.address,
          erc721Instance.address,
          tokenId,
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
        .connect(stranger)
        .startAuction(erc721Instance.address, tokenId, amount, 1000, timestamp, timestamp + span + span);
      await expect(tx1).to.be.revertedWith(`ERC721: transfer from incorrect owner`);
    });

    it("should fail: operator query for nonexistent token", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId + 1,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith(`ERC721: operator query for nonexistent token`);
    });

    it("should fail: collection address cannot be zerro", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        ethers.constants.AddressZero,
        tokenId,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith(`Auction: collection address cannot be zerro`);
    });

    it("should fail: auction start time should be less than end time", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount,
        1000,
        timestamp + span + span,
        timestamp,
      );
      await expect(tx1).to.be.revertedWith(`Auction: auction start time should be less than end time`);
    });

    it("should fail: auction start price should be positive", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        0,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1).to.be.revertedWith(`Auction: auction start price should be positive`);
    });

    it("should fail: auction should finished in future", async function () {
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount,
        1000,
        timestamp - 1000,
        timestamp - 100,
      );
      await expect(tx1).to.be.revertedWith(`Auction: auction should finished in future`);
    });
  });

  describe("makeBid", function () {
    it("should make bid", async function () {
      const span = 24 * 60 * 60;
      const timestamp: number = (await time.latest()).toNumber();

      const tx1 = auctionInstance.startAuction(
        erc721Instance.address,
        tokenId,
        amount,
        1000,
        timestamp,
        timestamp + span + span,
      );
      await expect(tx1)
        .to.emit(auctionInstance, "AuctionStart")
        .withArgs(0, owner.address, erc721Instance.address, tokenId, amount, 1000, timestamp, timestamp + span + span);

      const tx2 = erc20Instance.mint(receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, amount);

      const tx3 = erc20Instance.connect(receiver).approve(auctionInstance.address, amount);
      await expect(tx3).to.emit(erc20Instance, "Approval").withArgs(receiver.address, auctionInstance.address, amount);

      const tx4 = await auctionInstance.connect(receiver).makeBid(0, amount);
      await expect(tx4).to.emit(auctionInstance, "AuctionBid").withArgs(0, receiver.address, tokenId, amount);

      const balance = await erc20Instance.balanceOf(auctionInstance.address);
      expect(balance).to.equal(amount);

      const balance1 = await erc20Instance.balanceOf(receiver.address);
      expect(balance1).to.equal(0);
    });
  });

  // TODO finish tests
});
