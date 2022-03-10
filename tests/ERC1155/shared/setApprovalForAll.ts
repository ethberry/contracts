import { expect } from "chai";
import { amount, tokenId } from "../../constants";

export function shouldSetApprovalForAll() {
  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");

      const tx1 = this.erc1155Instance.setApprovalForAll(this.receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const isApproved1 = await this.erc1155Instance.isApprovedForAll(this.owner.address, this.receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = this.erc1155Instance.setApprovalForAll(this.receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const isApproved2 = await this.erc1155Instance.isApprovedForAll(this.owner.address, this.receiver.address);
      expect(isApproved2).to.equal(false);
    });

    it("should fail setting approval status for self", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");

      const tx = this.erc1155Instance.setApprovalForAll(this.owner.address, true);
      await expect(tx).to.be.revertedWith(`ERC1155: setting approval status for self`);
    });
  });
}
