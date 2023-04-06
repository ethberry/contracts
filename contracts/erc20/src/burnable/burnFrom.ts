import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldBurnFrom(factory: () => Promise<Contract>) {
  describe("burnFrom", function () {
    it("should fail: not allowed", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: insufficient balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn from other account", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);

      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, amount);
    });
  });
}
