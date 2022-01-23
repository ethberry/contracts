import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";

export function shouldBurnFrom() {
  describe("burnFrom", function () {
    it("should fail: burn from zero account", async function () {
      const tx = this.erc20Instance.burnFrom(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds allowance");
    });

    it("should fail: burn from other account", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      await this.erc20Instance.approve(this.receiver.address, amount);
      const tx = this.erc20Instance.connect(this.receiver).burnFrom(this.owner.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, amount);
    });
  });
}
