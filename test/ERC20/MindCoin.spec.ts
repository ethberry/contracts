import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindCoin } from "../../typechain-types";
import {
  amount,
  cap,
  DEFAULT_ADMIN_ROLE,
  initialTokenAmountInWei,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
  tokenName,
  tokenSymbol,
} from "../constants";

describe("MindCoin", function () {
  let coin: ContractFactory;
  let coinInstance: MindCoin;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("MindCoin");
    [owner, receiver, addr2] = await ethers.getSigners();

    coinInstance = (await coin.deploy(tokenName, tokenSymbol)) as MindCoin;

    await coinInstance.mint(owner.address, initialTokenAmountInWei);
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await coinInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await coinInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await coinInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
      const isSnapshoter = await coinInstance.hasRole(SNAPSHOT_ROLE, owner.address);
      expect(isSnapshoter).to.equal(true);
    });

    it("should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei);
      const ownerBalance = await coinInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const tx = coinInstance.connect(receiver).transfer(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      await coinInstance.transfer(receiver.address, amount);
      const receiverBalance = await coinInstance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);
      const ownerBalance = await coinInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });

  describe("Snapshot", function () {
    it("should fail: nonexistent id", async function () {
      await coinInstance.transfer(receiver.address, amount);
      const addr1Balance = await coinInstance.balanceOf(receiver.address);
      expect(addr1Balance).to.equal(amount);

      const tx = coinInstance.snapshot();
      await expect(tx).to.emit(coinInstance, "Snapshot").withArgs("1");

      const tx2 = coinInstance.balanceOfAt(receiver.address, "2");
      await expect(tx2).to.be.revertedWith("ERC20Snapshot: nonexistent id");
    });

    it("should make snapshot", async function () {
      await coinInstance.transfer(receiver.address, amount);
      const addr1Balance = await coinInstance.balanceOf(receiver.address);
      expect(addr1Balance).to.equal(amount);

      const tx = coinInstance.snapshot();

      await expect(tx).to.emit(coinInstance, "Snapshot").withArgs("1");

      const balance1 = await coinInstance.balanceOfAt(receiver.address, "1");
      expect(balance1).to.equal(amount);

      const balance2 = await coinInstance.balanceOfAt(addr2.address, "1");
      expect(balance2).to.equal(0);

      const totalSupply = await coinInstance.totalSupplyAt("1");
      expect(totalSupply).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Mint", function () {
    it("should fail: must have minter role to mint", async function () {
      const tx = coinInstance.connect(receiver).mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith("ERC20PresetMinterPauser: must have minter role to mint");
    });

    it("should fail: cap exceeded", async function () {
      const tx = coinInstance.mint(receiver.address, cap);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });

    it("should mint more tokens", async function () {
      await coinInstance.mint(owner.address, amount);
      const balance = await coinInstance.balanceOf(owner.address);
      expect(balance).to.equal(initialTokenAmountInWei.add(amount));
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei.add(amount));
    });
  });

  describe("Burn", function () {
    it("should fail: burn amount exceeds balance", async function () {
      const tx = coinInstance.burn(initialTokenAmountInWei.add(amount));
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn tokens", async function () {
      await coinInstance.burn(amount);
      const balance = await coinInstance.balanceOf(owner.address);
      expect(balance).to.equal(initialTokenAmountInWei.sub(amount));
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });
});
