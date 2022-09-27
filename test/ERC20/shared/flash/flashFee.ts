import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";

export function shouldFlashFee() {
  describe("flashFee", function () {
    it("token match", async function () {
      const flashFee = await this.erc20Instance.flashFee(this.erc20Instance.address, amount);
      expect(flashFee).to.equal(0);
    });

    it("token mismatch", async function () {
      const tx = this.erc20Instance.flashFee(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20FlashMint: wrong token");
    });
  });
}
