import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";
import { deployErc20Base } from "../fixtures";

export function shouldMaxFlashLoan(name: string) {
  describe("maxFlashLoan", function () {
    it("token match (zero)", async function () {
      const { contractInstance } = await deployErc20Base(name);

      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256);
    });

    it("token match (amount)", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256.sub(amount));
    });

    it("token mismatch", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(ethers.constants.AddressZero);
      expect(maxFlashLoan).to.equal(0);
    });
  });
}
