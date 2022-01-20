import { expect } from "chai";

export function shouldCappedEnumerable() {
  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      await this.erc721Instance.mint(this.owner.address, 0);
      await this.erc721Instance.mint(this.owner.address, 1);
      const cap = await this.erc721Instance.cap();
      expect(cap).to.equal(2);
      const totalSupply = await this.erc721Instance.totalSupply();
      expect(totalSupply).to.equal(2);
      const tx = this.erc721Instance.mint(this.owner.address, 2);
      await expect(tx).to.be.revertedWith(`ERC721CappedEnumerable: cap exceeded`);
    });
  });
}
