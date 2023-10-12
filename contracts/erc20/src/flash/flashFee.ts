import { expect } from "chai";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldFlashFee(factory: () => Promise<any>) {
  describe("flashFee", function () {
    it("should get fee", async function () {
      const contractInstance = await factory();

      const flashFee = await contractInstance.flashFee(contractInstance, amount);
      expect(flashFee).to.equal(0);
    });

    it("should fail: ERC3156UnsupportedToken", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.flashFee(ZeroAddress, amount);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC3156UnsupportedToken").withArgs(ZeroAddress);
    });
  });
}
