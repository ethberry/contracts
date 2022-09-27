import { expect } from "chai";

import { amount } from "../../../constants";

export function shouldMint() {
  describe("mint", function () {
    it("should fail: cap exceeded", async function () {
      const tx = this.contractInstance.mint(this.owner.address, amount + 1);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });
  });
}
