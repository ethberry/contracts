import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";

export function shouldApprove() {
  describe("approve", function () {
    it("should fail: approve to zero address", async function () {
      const tx = this.erc20Instance.approve(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20: approve to the zero address");
    });

    it("should approve with zero balance", async function () {
      const tx = this.erc20Instance.connect(this.receiver).approve(this.owner.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Approval")
        .withArgs(this.receiver.address, this.owner.address, amount);
    });

    it("should approve to self", async function () {
      const tx = this.erc20Instance.approve(this.owner.address, amount);
      await expect(tx).to.emit(this.erc20Instance, "Approval").withArgs(this.owner.address, this.owner.address, amount);
    });

    it("should approve", async function () {
      const tx = this.erc20Instance.approve(this.receiver.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Approval")
        .withArgs(this.owner.address, this.receiver.address, amount);

      const approved = await this.erc20Instance.allowance(this.owner.address, this.receiver.address);
      expect(approved).to.equal(amount);
    });
  });
}
