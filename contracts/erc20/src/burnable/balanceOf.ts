import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldBalanceOf2(factory: () => Promise<Contract>) {
  describe("balanceOf", function () {
    it("should not fail for zero addr", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);

      const tx = contractInstance.burn(amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, amount);

      const balance = await contractInstance.balanceOf(constants.AddressZero);
      expect(balance).to.equal(0);
    });
  });
}
