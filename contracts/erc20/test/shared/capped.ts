import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-test-constants";

import { deployErc20Base } from "./fixtures";

export function shouldERC20Capped(name: string) {
  describe("mint", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance.mint(owner.address, amount + 1);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });
  });
}
