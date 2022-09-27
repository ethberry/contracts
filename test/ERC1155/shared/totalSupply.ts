import { expect } from "chai";

import { amount, tokenId } from "../../constants";

// TODO wtf?
export function shouldGtTotalSupply() {
  describe("totalSupply", function () {
    it("should get total supply (mint)", async function () {
      await contractInstance.mint(receiver.address, tokenId, amount, "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should get total supply (mintBatch)", async function () {
      await contractInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
}
