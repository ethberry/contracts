import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldApprove() {
  describe("approve", function () {
    it("should fail: not an owner", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance.connect(this.receiver).approve(this.owner.address, 0);
      await expect(tx).to.be.revertedWith(`ComposableTopDown: approval to current owner`);
    });

    it("should fail: approve to self", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance.approve(this.owner.address, 0);
      await expect(tx).to.be.revertedWith("ComposableTopDown: approval to current owner");
    });

    it("should approve", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance.approve(this.receiver.address, 0);

      await expect(tx).to.emit(this.erc998Instance, "Approval").withArgs(this.owner.address, this.receiver.address, 0);

      const approved = await this.erc998Instance.getApproved(0);
      expect(approved).to.equal(this.receiver.address);

      const tx1 = this.erc998Instance.connect(this.receiver).burn(0);
      await expect(tx1).to.emit(this.erc998Instance, "Transfer").withArgs(this.owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await this.erc998Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
