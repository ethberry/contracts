import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployJerk } from "@gemunion/contracts-mocks";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldTransferFrom(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("transferFrom", function () {
    it("should transfer", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
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
      const erc20NonReceiverInstance = await deployJerk();
      const address = await erc20NonReceiverInstance.getAddress();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);

      const tx = contractInstance.connect(receiver).transferFrom(owner.address, address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, address, amount);

      const nonReceiverBalance = await contractInstance.balanceOf(address);
      expect(nonReceiverBalance).to.equal(amount);
      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should fail: double transfer, amount exceeds allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);

      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const tx1 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer to the zero address", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, ZeroAddress, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer to the zero address`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, 0n);
      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });

    it("should fail: transfer amount exceeds allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: insufficient allowance`);
    });
  });
}
