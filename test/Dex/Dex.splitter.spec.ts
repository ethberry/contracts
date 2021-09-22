import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DexWithSplitter, MindCoin } from "../../typechain";
import { decimals, initialTokenAmount, initialTokenAmountInWei } from "../constants";
import { parseEther } from "ethers/lib/utils";

describe("DEX with Oracle", function () {
  let token: ContractFactory;
  let market: ContractFactory;
  let tokenInstance: MindCoin;
  let marketInstance: DexWithSplitter;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    market = await ethers.getContractFactory("DexWithSplitter");
    [owner, addr1] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
    marketInstance = (await upgrades.deployProxy(market, [
      tokenInstance.address,
      [owner.address, addr1.address],
      [1, 1],
    ])) as DexWithSplitter;
  });

  describe("Deployment", function () {
    it("DEX should has zero balance", async function () {
      const balanceOfDex = await tokenInstance.balanceOf(marketInstance.address);
      expect(balanceOfDex).to.equal(0);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Release", function () {
    it("DEX should NOT release, when no balance", async function () {
      const tx = marketInstance.release(owner.address);
      await expect(tx).to.be.revertedWith("PaymentSplitter: account is not due payment");
    });

    it("DEX should release", async function () {
      await owner.sendTransaction({
        to: marketInstance.address,
        value: parseEther("1"),
      });

      await marketInstance.release(owner.address);

      const balance = await ethers.provider.getBalance(marketInstance.address);
      expect(balance).to.equal(decimals.div(2));
    });
  });
});
