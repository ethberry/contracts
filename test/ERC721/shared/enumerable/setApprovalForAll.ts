import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldSetApprovalForAll() {
  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(2);

      const tx1 = this.erc721Instance.setApprovalForAll(this.receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await this.erc721Instance.getApproved(0);
      expect(approved1).to.equal(ethers.constants.AddressZero);

      const isApproved1 = await this.erc721Instance.isApprovedForAll(this.owner.address, this.receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = this.erc721Instance.setApprovalForAll(this.receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await this.erc721Instance.getApproved(0);
      expect(approved3).to.equal(ethers.constants.AddressZero);

      const isApproved2 = await this.erc721Instance.isApprovedForAll(this.owner.address, this.receiver.address);
      expect(isApproved2).to.equal(false);
    });
  });
}
