import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldFlashFeeReceiver() {
  describe("flashFeeReceiver", function () {
    it("default receiver", async function () {
      const flashFeeReceiver = await this.erc20Instance.flashFeeReceiver();
      expect(flashFeeReceiver).to.equal(ethers.constants.AddressZero);
    });
  });
}
