import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@ethberry/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldApprove(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("approve", function () {
    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const tx = contractInstance.approve(receiver, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner, receiver, amount);

      const approved = await contractInstance.allowance(owner, receiver);
      expect(approved).to.equal(amount);
    });

    it("should approve with zero balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).approve(owner, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(receiver, owner, amount);
    });

    it("should approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.approve(owner, amount);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner, owner, amount);
    });

    it("should fail: ERC20InvalidSpender", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.approve(ZeroAddress, amount);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC20InvalidSpender").withArgs(ZeroAddress);
    });
  });
}
