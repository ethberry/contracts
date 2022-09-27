import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";

export function shouldBurnFrom() {
  describe("burnFrom", function () {
    it("should fail: not allowed", async function () {
      const tx = this.contractInstance.connect(this.receiver).burnFrom(this.owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: insufficient balance", async function () {
      await this.contractInstance.approve(this.receiver.address, amount);
      const tx = this.contractInstance.connect(this.receiver).burnFrom(this.owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn from other account", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      await this.contractInstance.approve(this.receiver.address, amount);
      const tx = this.contractInstance.connect(this.receiver).burnFrom(this.owner.address, amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, amount);
    });
  });
}
