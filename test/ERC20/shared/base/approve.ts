import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";
import { deployErc20Base } from "../fixtures";

export function shouldApprove(name: string) {
  describe("approve", function () {
    it("should fail: approve to zero address", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance.approve(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20: approve to the zero address");
    });

    it("should approve with zero balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance.connect(receiver).approve(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(receiver.address, owner.address, amount);
    });

    it("should approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance.approve(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner.address, owner.address, amount);
    });

    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance.approve(receiver.address, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner.address, receiver.address, amount);

      const approved = await contractInstance.allowance(owner.address, receiver.address);
      expect(approved).to.equal(amount);
    });
  });
}
