import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "../../../constants";

export function shouldBalanceOf() {
  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = this.erc1155Instance.balanceOf(ethers.constants.AddressZero, tokenId);
      await expect(tx).to.be.revertedWith(`ERC1155: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const balance = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const balance = await this.erc1155Instance.balanceOf(this.receiver.address, tokenId);
      expect(balance).to.equal(0);
    });
  });
}
