import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";

export function shouldBalanceOf() {
  describe("balanceOf", function () {
    it("should not fail for zero addr", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const tx = this.erc20Instance.burn(amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, amount);

      const balance = await this.erc20Instance.balanceOf(ethers.constants.AddressZero);
      expect(balance).to.equal(0);
    });

    it("should get balance of owner", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const balance = await this.erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const balance = await this.erc20Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(0);
    });
  });
}
