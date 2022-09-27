import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";
import { deployErc20Base } from "../fixtures";

export function shouldFlashFee(name: string) {
  describe("flashFee", function () {
    it("token match", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const flashFee = await contractInstance.flashFee(contractInstance.address, amount);
      expect(flashFee).to.equal(0);
    });

    it("token mismatch", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance.flashFee(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20FlashMint: wrong token");
    });
  });
}
