import { expect } from "chai";

import { amount, tokenId } from "../../constants";

export function shouldGtTotalSupply() {
  describe("totalSupply", function () {
    it("should get total supply (mint)", async function () {
      await this.erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");

      const totalSupply = await this.erc1155Instance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should get total supply (mintBatch)", async function () {
      await this.erc1155Instance.mintBatch(this.receiver.address, [tokenId], [amount], "0x");

      const totalSupply = await this.erc1155Instance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
}
