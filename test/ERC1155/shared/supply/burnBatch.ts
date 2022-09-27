import { expect } from "chai";
import { amount, tokenId } from "../../../constants";

export function shouldBurnBatch() {
  describe("burnBatch", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      await this.erc1155Instance.mintBatch(this.owner.address, [tokenId], [amount], "0x");

      const tx = this.erc1155Instance.burnBatch(this.owner.address, [tokenId], [amount * 2]);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
