import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DexWithOracle, MindCoin, PriceOracle } from "../../typechain";
import { amount, decimals, initialTokenAmount, initialTokenAmountInWei } from "../constants";
import { parseEther } from "ethers/lib/utils";

describe("DEX with Oracle", function () {
  let token: ContractFactory;
  let oracle: ContractFactory;
  let market: ContractFactory;
  let tokenInstance: MindCoin;
  let marketInstance: DexWithOracle;
  let oracleInstance: PriceOracle;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const multiplier = 5;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    oracle = await ethers.getContractFactory("PriceOracle");
    market = await ethers.getContractFactory("DexWithOracle");
    [owner, addr1] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
    oracleInstance = (await upgrades.deployProxy(oracle)) as PriceOracle;
    marketInstance = (await upgrades.deployProxy(market, [
      tokenInstance.address,
      oracleInstance.address,
    ])) as DexWithOracle;
  });

  describe("Deployment", function () {
    it("DEX should has zero balance", async function () {
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(0);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Buy", function () {
    it("should buy tokens for initial price", async function () {
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

    it("should buy tokens for new price", async function () {
      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, marketInstance.address, amount);

      await oracleInstance.updatePrice(multiplier);

      await marketInstance.connect(addr1).buy({ value: amount });
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(amount - amount / multiplier);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));
      const balanceOfBuyer = await tokenInstance.balanceOf(addr1.address);
      expect(balanceOfBuyer).to.equal(amount / multiplier);
    });
  });

  describe("Sell", function () {
    it("should sell tokens for initial price", async function () {
      // contract should has eth
      await owner.sendTransaction({
        to: marketInstance.address,
        value: parseEther("1"),
      });

      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, addr1.address, amount);

      await oracleInstance.updatePrice(multiplier);

      await tokenInstance.connect(addr1).approve(marketInstance.address, amount);
      await marketInstance.connect(addr1).sell(amount);

      const balanceOfSeller = await tokenInstance.balanceOf(addr1.address);
      expect(balanceOfSeller).to.equal(0);
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(amount);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));
    });

    it("should sell tokens for new price", async function () {
      // contract should has eth
      await owner.sendTransaction({
        to: marketInstance.address,
        value: parseEther("1"),
      });

      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, addr1.address, amount);

      await oracleInstance.updatePrice(multiplier);

      await tokenInstance.connect(addr1).approve(marketInstance.address, amount);
      await marketInstance.connect(addr1).sell(amount);

      const balanceOfSeller = await tokenInstance.balanceOf(addr1.address);
      expect(balanceOfSeller).to.equal(0);
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(amount);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));

      const balance = await ethers.provider.getBalance(marketInstance.address);
      expect(balance).to.equal(decimals.sub(amount * multiplier));
    });
  });
});
