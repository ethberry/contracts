import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldBalanceOf(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("balanceOf", function () {
    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });

    it("should not fail for zero addr", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const balance = await contractInstance.balanceOf(ZeroAddress);
      expect(balance).to.equal(0);
    });
  });
}
