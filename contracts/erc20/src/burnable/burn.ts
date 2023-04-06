import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldBurn(factory: () => Promise<Contract>) {
  describe("burn", function () {
    it("should fail: burn amount exceeds balance", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.burn(amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn zero", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.burn(0);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, 0);
    });

    it("should burn tokens", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, amount);

      const tx = contractInstance.burn(amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, amount);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(0);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(0);
    });
  });
}
