import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";

import { Dex, MindCoin } from "../../typechain";
import { initialTokenAmount, initialTokenAmountInWei } from "../constants";

describe("ERC20 DEX", function () {
  let token: ContractFactory;
  let market: ContractFactory;
  let tokenInstance: MindCoin;
  let marketInstance: Dex;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  const amount = 100;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    market = await ethers.getContractFactory("Dex");
    [owner, addr1] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
    marketInstance = (await upgrades.deployProxy(market, [tokenInstance.address])) as Dex;
  });

  describe("Deployment", function () {
    it("DEX should has zero balance", async function () {
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(0);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Transfer", function () {
    it("should transfer tokens to DEX without approve", async function () {
      const transfer = tokenInstance.transferFrom(owner.address, marketInstance.address, amount);
      await expect(transfer).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("should transfer tokens to DEX with partial approve", async function () {
      await tokenInstance.approve(owner.address, amount / 2);
      const transfer = tokenInstance.transferFrom(owner.address, marketInstance.address, amount);
      await expect(transfer).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("should transfer tokens to DEX", async function () {
      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, marketInstance.address, amount);
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(amount);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });

  describe("Buy", function () {
    it("should fail with out ether", async function () {
      const transfer = marketInstance.connect(addr1).buy({ value: 0 });
      await expect(transfer).to.be.revertedWith("You need to send some ether");
    });

    it("should fail with no balance", async function () {
      const transfer = marketInstance.connect(addr1).buy({ value: amount });
      await expect(transfer).to.be.revertedWith("Not enough tokens in the reserve");
    });

    it("should fail with partial balance", async function () {
      await tokenInstance.approve(owner.address, amount / 2);
      await tokenInstance.transferFrom(owner.address, marketInstance.address, amount / 2);
      const transfer = marketInstance.connect(addr1).buy({ value: amount });
      await expect(transfer).to.be.revertedWith("Not enough tokens in the reserve");
    });

    it("should buy tokens", async function () {
      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, marketInstance.address, amount);

      await marketInstance.connect(addr1).buy({ value: amount });
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(0);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));
      const balanceOfBuyer = await tokenInstance.balanceOf(addr1.address);
      expect(balanceOfBuyer).to.equal(amount);
    });
  });

  describe("Sell", function () {
    it("should fail with tokens", async function () {
      const transfer = marketInstance.connect(addr1).sell(0);
      await expect(transfer).to.be.revertedWith("You need to sell at least some tokens");
    });

    it("should fail no allowance", async function () {
      const transfer = marketInstance.connect(addr1).sell(amount);
      await expect(transfer).to.be.revertedWith("Check the token allowance");
    });

    it("should fail with partial balance", async function () {
      await tokenInstance.connect(addr1).approve(marketInstance.address, amount);
      const transfer = marketInstance.connect(addr1).sell(amount);
      await expect(transfer).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should sell tokens", async function () {
      // contract should has eth
      await owner.sendTransaction({
        to: marketInstance.address,
        value: parseEther("1"),
      });

      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, addr1.address, amount);

      await tokenInstance.connect(addr1).approve(marketInstance.address, amount);
      await marketInstance.connect(addr1).sell(amount);

      const balanceOfSeller = await tokenInstance.balanceOf(addr1.address);
      expect(balanceOfSeller).to.equal(0);
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(amount);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });
});
