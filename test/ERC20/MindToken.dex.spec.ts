import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DEX, MindCoin } from "../../typechain";
import { initialTokenAmount, initialTokenAmountInWei } from "../constants";

describe("ERC20 DEX", function () {
  let token: ContractFactory;
  let market: ContractFactory;
  let tokenInstance: MindCoin;
  let marketInstance: DEX;
  let owner: SignerWithAddress;

  const amount = 100;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    market = await ethers.getContractFactory("DEX");
    [owner] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
    marketInstance = (await upgrades.deployProxy(market, [tokenInstance.address])) as DEX;
  });

  describe("Deployment", function () {
    it("DEX should has zero balance", async function () {
      const balance = await tokenInstance.balanceOf(marketInstance.address);
      expect(balance).to.equal(0);
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
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfDex).to.equal(amount);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });
});
