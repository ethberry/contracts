import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldGetBalanceOf() {
  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = this.erc998Instance.balanceOf(ethers.constants.AddressZero);
      await expect(tx).to.be.revertedWith(`ERC721: balance query for the zero address`);
    });

    it("should get balance of owner", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const balance = await this.erc998Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const balance = await this.erc998Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(0);
    });
  });
}
