import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";

export function shouldBalanceOf() {
  describe("balanceOf", function () {
    it("should not fail for zero addr", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      const tx = this.contractInstance.burn(amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, amount);

      const balance = await this.contractInstance.balanceOf(ethers.constants.AddressZero);
      expect(balance).to.equal(0);
    });
  });
}
