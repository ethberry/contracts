import { expect } from "chai";
import { tokenId } from "../../../constants";

export function shouldGetOwnerOf() {
  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const ownerOfToken = await this.erc721Instance.ownerOf(tokenId);
      expect(ownerOfToken).to.equal(this.owner.address);
    });

    it("should get owner of burned token", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance.burn(tokenId);
      await expect(tx).to.not.be.reverted;

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const tx2 = this.erc721Instance.ownerOf(tokenId);
      // https://github.com/TrueFiEng/Waffle/issues/761
      // await expect(tx2).to.be.revertedWith(`ERC721: invalid token ID`);
      await expect(tx2).to.be.reverted;
    });
  });
}
