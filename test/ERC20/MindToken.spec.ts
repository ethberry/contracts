import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindCoin } from "../../typechain";
import {
  amount,
  DEFAULT_ADMIN_ROLE,
  initialTokenAmount,
  initialTokenAmountInWei,
  MINTER_ROLE,
  PAUSER_ROLE,
} from "../constants";

describe("ERC20 basic", function () {
  let token: ContractFactory;
  let tokenInstance: MindCoin;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    token = await ethers.getContractFactory("MindCoin");
    [owner, addr1, addr2] = await ethers.getSigners();

    tokenInstance = (await upgrades.deployProxy(token, [
      "memoryOS COIN token",
      "MIND",
      initialTokenAmount,
    ])) as MindCoin;
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      expect(await tokenInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
      expect(await tokenInstance.hasRole(MINTER_ROLE, owner.address)).to.equal(true);
      expect(await tokenInstance.hasRole(PAUSER_ROLE, owner.address)).to.equal(true);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await tokenInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei);
      const ownerBalance = await tokenInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await tokenInstance.transfer(addr1.address, amount);
      const addr1Balance = await tokenInstance.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);

      await tokenInstance.connect(addr1).transfer(addr2.address, amount);
      const addr2Balance = await tokenInstance.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(amount);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await tokenInstance.balanceOf(owner.address);

      const tx = tokenInstance.connect(addr1).transfer(owner.address, 1);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      const balance = await tokenInstance.balanceOf(owner.address);
      expect(balance).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await tokenInstance.balanceOf(owner.address);

      await tokenInstance.transfer(addr1.address, amount);

      await tokenInstance.transfer(addr2.address, amount / 2);

      const finalOwnerBalance = await tokenInstance.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(amount).sub(amount / 2));

      const addr1Balance = await tokenInstance.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);

      const addr2Balance = await tokenInstance.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(amount / 2);
    });
  });
});
