import { expect } from "chai";
import { amount, tokenId } from "../../../constants";

export function shouldBurn() {
  describe("burn", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");

      const tx = this.erc1155Instance.burn(this.owner.address, tokenId, amount * 2);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
