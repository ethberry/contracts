import { expect } from "chai";
import { ethers } from "hardhat";
import { MaxUint256, ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldMaxFlashLoan(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("maxFlashLoan", function () {
    it("token match (zero)", async function () {
      const contractInstance = await factory();

      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance);
      expect(maxFlashLoan).to.equal(MaxUint256);
    });

    it("token match (amount)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(contractInstance);
      expect(maxFlashLoan).to.equal(MaxUint256 - amount);
    });

    it("token mismatch", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, amount);
      const maxFlashLoan = await contractInstance.maxFlashLoan(ZeroAddress);
      expect(maxFlashLoan).to.equal(0);
    });
  });
}
