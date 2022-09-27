import { expect } from "chai";

import { amount, tokenId } from "../../../constants";

export function shouldMintBatch() {
  describe("mintBatch", function () {
    it("should fail: double mint", async function () {
      await this.erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
      const tx1 = this.erc1155Instance.mintBatch(this.receiver.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith("ERC1155Capped: subsequent mint not allowed");
    });
  });
}
