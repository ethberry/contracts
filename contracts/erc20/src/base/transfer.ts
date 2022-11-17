import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { deployErc20Wallet } from "../fixtures";

export function shouldTransfer(factory: () => Promise<Contract>) {
  describe("transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);

      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const receiverBalance = await contractInstance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const { contractInstance: erc20NonReceiverInstance } = await deployErc20Wallet();

      await contractInstance.mint(owner.address, amount);

      const tx = contractInstance.transfer(erc20NonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, erc20NonReceiverInstance.address, amount);

      const nonReceiverBalance = await contractInstance.balanceOf(erc20NonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
