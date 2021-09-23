import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindCoin, MindTokenTimelock, TokenTimelockUpgradeable } from "../../typechain";
import { amount, initialTokenAmount, initialTokenAmountInWei } from "../constants";

describe.skip("Time Lock", function () {
  let token: ContractFactory;
  let timelock: ContractFactory;
  let tokenInstance: MindCoin;
  let timelockInstance: TokenTimelockUpgradeable;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const releaseAfter = 10; // sec

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    timelock = await ethers.getContractFactory("MindTokenTimelock");
    [owner, addr1] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
    timelockInstance = (await upgrades.deployProxy(timelock, [
      tokenInstance.address,
      addr1.address,
      Math.floor(Date.now() / 1000) + releaseAfter,
    ])) as MindTokenTimelock;
  });

  describe("Deployment", function () {
    it("TimeLock should has zero balance", async function () {
      const balanceOfDex = await tokenInstance.balanceOf(timelockInstance.address);
      expect(balanceOfDex).to.equal(0);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Lock", function () {
    it("should NOT release tokens", async function () {
      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, timelockInstance.address, amount);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));

      const tx = timelockInstance.connect(addr1).release();
      await expect(tx).to.be.revertedWith("TokenTimelock: current time is before release time");
    });

    it("should release tokens", async function () {
      this.timeout(11000);

      await tokenInstance.approve(owner.address, amount);
      await tokenInstance.transferFrom(owner.address, timelockInstance.address, amount);
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei.sub(amount));

      await new Promise(resolve => setTimeout(resolve, releaseAfter * 1000));

      await timelockInstance.connect(addr1).release();
      const balanceOfAdvisor = await tokenInstance.balanceOf(addr1.address);
      expect(balanceOfAdvisor).to.equal(amount);
      const balanceOfTimelock = await tokenInstance.balanceOf(timelockInstance.address);
      expect(balanceOfTimelock).to.equal(0);
    });
  });
});
