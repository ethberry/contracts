import { expect } from "chai";
import { constants, Contract } from "ethers";

export function shouldFlashFeeReceiver(factory: () => Promise<Contract>) {
  describe("flashFeeReceiver", function () {
    it("default receiver", async function () {
      const contractInstance = await factory();

      const flashFeeReceiver = await contractInstance.flashFeeReceiver();
      expect(flashFeeReceiver).to.equal(constants.AddressZero);
    });
  });
}
