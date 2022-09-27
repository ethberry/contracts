import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";

export function shouldMaxFlashLoan() {
  describe("maxFlashLoan", function () {
    it("token match (zero)", async function () {
      const maxFlashLoan = await this.erc20Instance.maxFlashLoan(this.erc20Instance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256);
    });

    it("token match (amount)", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      const maxFlashLoan = await this.erc20Instance.maxFlashLoan(this.erc20Instance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256.sub(amount));
    });

    it("token mismatch", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      const maxFlashLoan = await this.erc20Instance.maxFlashLoan(ethers.constants.AddressZero);
      expect(maxFlashLoan).to.equal(0);
    });
  });
}
