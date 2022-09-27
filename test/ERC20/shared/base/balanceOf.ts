import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";
import { deployErc20Base } from "../fixtures";

export function shouldBalanceOf(name: string) {
  describe("balanceOf", function () {
    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });

    it("should not fail for zero addr", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const balance = await contractInstance.balanceOf(ethers.constants.AddressZero);
      expect(balance).to.equal(0);
    });
  });
}
