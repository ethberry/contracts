import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldFlashFee(factory: () => Promise<Contract>) {
  describe("flashFee", function () {
    it("token match", async function () {
      const contractInstance = await factory();

      const flashFee = await contractInstance.flashFee(contractInstance.address, amount);
      expect(flashFee).to.equal(0);
    });

    it("token mismatch", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.flashFee(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20FlashMint: wrong token");
    });
  });
}
