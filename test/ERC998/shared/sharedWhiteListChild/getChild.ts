import { expect } from "chai";

export function shouldGetChild() {
  describe("getChild", function () {
    it("should get child", async function () {
      await this.erc998Instance.whiteListChild(this.erc721Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.approve(this.erc998Instance.address, 0);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance.getChild(this.owner.address, 1, this.erc721Instance.address, 0);
      await expect(tx1).to.be.revertedWith(`ERC998ERC721TopDown: this method is not supported`);
    });
  });
}