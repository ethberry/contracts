import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc20Base } from "../fixtures";

export function shouldFlashFeeReceiver(name: string) {
  describe("flashFeeReceiver", function () {
    it("default receiver", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const flashFeeReceiver = await contractInstance.flashFeeReceiver();
      expect(flashFeeReceiver).to.equal(ethers.constants.AddressZero);
    });
  });
}
