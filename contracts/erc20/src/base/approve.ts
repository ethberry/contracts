import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldApprove(factory: () => Promise<Contract>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("approve", function () {
    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance.approve(receiver.address, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner.address, receiver.address, amount);

      const approved = await contractInstance.allowance(owner.address, receiver.address);
      expect(approved).to.equal(amount);
    });

    it("should approve with zero balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).approve(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(receiver.address, owner.address, amount);
    });

    it("should approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.approve(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner.address, owner.address, amount);
    });

    it("should fail: approve to zero address", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.approve(constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20: approve to the zero address");
    });
  });
}
