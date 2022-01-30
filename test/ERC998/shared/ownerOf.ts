import { expect } from "chai";

export function shouldGetOwnerOf() {
  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const ownerOfToken = await this.erc998Instance.ownerOf(0);
      expect(ownerOfToken).to.equal(this.owner.address);
    });

    it("should get owner of burned token", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance.burn(0);
      await expect(tx).to.not.be.reverted;
      const balanceOfOwner = await this.erc998Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
      const tx2 = this.erc998Instance.ownerOf(0);
      await expect(tx2).to.be.revertedWith(`ERC721: owner query for nonexistent token`);
    });
  });
}
