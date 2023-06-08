import { expect } from "chai";
import { ZeroAddress } from "ethers";

export function shouldFlashFeeReceiver(factory: () => Promise<any>) {
  describe("flashFeeReceiver", function () {
    it("default receiver", async function () {
      const contractInstance = await factory();

      const flashFeeReceiver = await contractInstance.flashFeeReceiver();
      expect(flashFeeReceiver).to.equal(ZeroAddress);
    });
  });
}
