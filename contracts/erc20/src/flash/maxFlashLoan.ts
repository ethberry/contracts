import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldMaxFlashLoan(factory: () => Promise<Contract>) {
  describe("maxFlashLoan", function () {
    it("token match (zero)", async function () {
      const contractInstance = await factory();

      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256);
    });

    it("token match (amount)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256.sub(amount));
    });

    it("token mismatch", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(ethers.constants.AddressZero);
      expect(maxFlashLoan).to.equal(0);
    });
  });
}
