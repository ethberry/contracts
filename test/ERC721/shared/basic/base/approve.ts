import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "../../../../constants";

export function shouldApprove() {
  describe("approve", function () {
    it("should fail: not an owner", async function () {
      await this.contractInstance.mint(this.owner.address, tokenId);
      const tx = this.contractInstance.connect(this.receiver).approve(this.owner.address, tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      await this.contractInstance.mint(this.owner.address, tokenId);
      const tx = this.contractInstance.approve(this.owner.address, tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      await this.contractInstance.mint(this.owner.address, tokenId);

      const tx = this.contractInstance.approve(this.receiver.address, tokenId);
      await expect(tx)
        .to.emit(this.contractInstance, "Approval")
        .withArgs(this.owner.address, this.receiver.address, tokenId);

      const approved = await this.contractInstance.getApproved(tokenId);
      expect(approved).to.equal(this.receiver.address);

      const tx1 = this.contractInstance.connect(this.receiver).burn(tokenId);
      await expect(tx1)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
