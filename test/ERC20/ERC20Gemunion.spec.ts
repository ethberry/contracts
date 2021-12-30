import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20GemunionTest, ERC20GemunionNonReceiverTest } from "../../typechain-types";
import {
  amount,
  erc20cap,
  DEFAULT_ADMIN_ROLE,
  initialTokenAmountInWei,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
  tokenName,
  tokenSymbol,
  ZERO_ADDR,
} from "../constants";

describe("ERC20Gemunion", function () {
  let coin: ContractFactory;
  let coinInstance: ERC20GemunionTest;
  let coinNonReceiver: ContractFactory;
  let coinNonReceiverInstance: ERC20GemunionNonReceiverTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("ERC20GemunionTest");
    coinNonReceiver = await ethers.getContractFactory("ERC20GemunionNonReceiverTest");
    [owner, receiver, addr2] = await ethers.getSigners();

    coinInstance = (await coin.deploy(tokenName, tokenSymbol)) as ERC20GemunionTest;
    coinNonReceiverInstance = (await coinNonReceiver.deploy(tokenName, tokenSymbol)) as ERC20GemunionNonReceiverTest;

    await coinInstance.mint(owner.address, initialTokenAmountInWei);
  });

  describe("constructor", function () {
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

  describe("transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const tx = coinInstance.connect(receiver).transfer(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      const tx = coinInstance.transfer(receiver.address, amount);
      await expect(tx).to.emit(coinInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const receiverBalance = await coinInstance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);
      const ownerBalance = await coinInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialTokenAmountInWei.sub(amount));
    });

    it("should transfer to contract", async function () {
      const tx = coinInstance.transfer(coinNonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(coinInstance, "Transfer")
        .withArgs(owner.address, coinNonReceiverInstance.address, amount);

      const receiverBalance = await coinInstance.balanceOf(coinNonReceiverInstance.address);
      expect(receiverBalance).to.equal(amount);
      const ownerBalance = await coinInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });

  describe("snapshot", function () {
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

  describe("mint", function () {
    it("should fail: must have minter role to mint", async function () {
      const tx = coinInstance.connect(receiver).mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith("ERC20Gemunion: must have minter role to mint");
    });

    it("should mint more tokens", async function () {
      const tx = coinInstance.mint(owner.address, amount);
      await expect(tx).to.emit(coinInstance, "Transfer").withArgs(ZERO_ADDR, owner.address, amount);

      const balance = await coinInstance.balanceOf(owner.address);
      expect(balance).to.equal(initialTokenAmountInWei.add(amount));
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei.add(amount));
    });
  });

  describe("burn", function () {
    it("should fail: burn amount exceeds balance", async function () {
      const tx = coinInstance.burn(initialTokenAmountInWei.add(amount));
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn tokens", async function () {
      const tx = coinInstance.burn(amount);
      await expect(tx).to.emit(coinInstance, "Transfer").withArgs(owner.address, ZERO_ADDR, amount);

      const balance = await coinInstance.balanceOf(owner.address);
      expect(balance).to.equal(initialTokenAmountInWei.sub(amount));
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei.sub(amount));
    });
  });

  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const tx = coinInstance.mint(owner.address, erc20cap);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC20 = await coinInstance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await coinInstance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);

      const supportsIERC165 = await coinInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await coinInstance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsIAccessControlEnumerable = await coinInstance.supportsInterface("0x5a05180f");
      expect(supportsIAccessControlEnumerable).to.equal(true);

      const supportsInvalidInterface = await coinInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});
