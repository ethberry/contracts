import { expect } from "chai";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldFlashFee(factory: () => Promise<any>) {
  describe("flashFee", function () {
    it("token match", async function () {
      const contractInstance = await factory();
      const address = await contractInstance.getAddress();

      const flashFee = await contractInstance.flashFee(address, amount);
      expect(flashFee).to.equal(0);
    });

    it("token mismatch", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.flashFee(ZeroAddress, amount);
      await expect(tx).to.be.revertedWith("ERC20FlashMint: wrong token");
    });
  });
}
