import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldGetBalanceOf() {
  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = this.erc721Instance.balanceOf(ethers.constants.AddressZero);
      // https://github.com/TrueFiEng/Waffle/issues/761
      // await expect(tx).to.be.revertedWith(`ERC721: address zero is not a valid owner`);
      await expect(tx).to.be.reverted;
    });

    it("should get balance of owner", async function () {
      await this.erc721Instance.mint(this.owner.address);
      const balance = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      await this.erc721Instance.mint(this.owner.address);
      const balance = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(0);
    });
  });
}
