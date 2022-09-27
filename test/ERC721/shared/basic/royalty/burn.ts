import { expect } from "chai";
import { ethers } from "hardhat";

import { royalty, tokenId } from "../../../../constants";

export function shouldBurn() {
  describe("burn", function () {
    it("should reset token royalty info", async function () {
      await this.contractInstance.mint(this.owner.address, tokenId);

      await this.contractInstance.setTokenRoyalty(tokenId, this.owner.address, royalty * 2);
      const [receiver, amount] = await this.contractInstance.royaltyInfo(tokenId, 1e6);
      expect(receiver).to.equal(this.owner.address);
      expect(amount).to.equal(20000);

      const tx = await this.contractInstance.burn(tokenId);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const [receiver2, amount2] = await this.contractInstance.royaltyInfo(tokenId, 1e6);
      expect(receiver2).to.equal(this.owner.address);
      expect(amount2).to.equal(10000);
    });
  });
}
