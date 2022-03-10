import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";

export function shouldBurn() {
  describe("burn", function () {
    it("should fail: burn amount exceeds balance", async function () {
      const tx = this.erc20Instance.burn(amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn zero", async function () {
      const tx = this.erc20Instance.burn(0);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, 0);
    });

    it("should burn tokens", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const tx = this.erc20Instance.burn(amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, amount);

      const balance = await this.erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);

      const totalSupply = await this.erc20Instance.totalSupply();
      expect(totalSupply).to.equal(0);
    });
  });
}
