import { expect } from "chai";
import { ethers } from "hardhat";
import { royalty, tokenId } from "../../../constants";

export function shouldBurnBasic(enumerable = false) {
  describe("burn (basic)", function () {
    it("should reset token royalty info", async function () {
      if (enumerable) {
        await this.erc721Instance.mint(this.owner.address); // 0
        await this.erc721Instance.mint(this.owner.address); // 1
      } else {
        await this.erc721Instance.mint(this.owner.address, tokenId);
      }

      await this.erc721Instance.setTokenRoyalty(tokenId, this.owner.address, royalty * 2);
      const [receiver, amount] = await this.erc721Instance.royaltyInfo(tokenId, 1e6);
      expect(receiver).to.equal(this.owner.address);
      expect(amount).to.equal(20000);

      const tx = await this.erc721Instance.burn(tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const [receiver2, amount2] = await this.erc721Instance.royaltyInfo(tokenId, 1e6);
      expect(receiver2).to.equal(this.owner.address);
      expect(amount2).to.equal(10000);
    });
  });
}
