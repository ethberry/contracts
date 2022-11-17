import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { deployErc20Wallet } from "../fixtures";

export function shouldTransferFrom(factory: () => Promise<Contract>) {
  describe("transferFrom", function () {
    it("should transfer", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);
      await contractInstance.approve(receiver.address, amount);

      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const receiverBalance = await contractInstance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);
      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const { contractInstance: erc20NonReceiverInstance } = await deployErc20Wallet();

      await contractInstance.mint(owner.address, amount);
      await contractInstance.approve(receiver.address, amount);

      const tx = contractInstance
        .connect(receiver)
        .transferFrom(owner.address, erc20NonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, erc20NonReceiverInstance.address, amount);

      const nonReceiverBalance = await contractInstance.balanceOf(erc20NonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);
      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should fail: double transfer, amount exceeds allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);
      await contractInstance.approve(receiver.address, amount);

      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const tx1 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer to the zero address", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);
      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer to the zero address`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });

    it("should fail: transfer amount exceeds allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: insufficient allowance`);
    });
  });
}
