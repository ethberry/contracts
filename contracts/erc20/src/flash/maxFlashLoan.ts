import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldMaxFlashLoan(factory: () => Promise<Contract>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("maxFlashLoan", function () {
    it("token match (zero)", async function () {
      const contractInstance = await factory();

      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance.address);
      expect(maxFlashLoan).to.equal(constants.MaxUint256);
    });

    it("token match (amount)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance.address);
      expect(maxFlashLoan).to.equal(constants.MaxUint256.sub(amount));
    });

    it("token mismatch", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(constants.AddressZero);
      expect(maxFlashLoan).to.equal(0);
    });
  });
}
