import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";
import { deployErc20Base } from "../fixtures";

export function shouldBalanceOf(name: string) {
  describe("balanceOf", function () {
    it("should not fail for zero addr", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const tx = contractInstance.burn(amount);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, ethers.constants.AddressZero, amount);

      const balance = await contractInstance.balanceOf(ethers.constants.AddressZero);
      expect(balance).to.equal(0);
    });
  });
}
